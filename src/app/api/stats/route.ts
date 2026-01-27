import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import Exam from '@/models/Exam';
import Result from '@/models/Result';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        const token = cookies().get('token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const decoded: any = verifyToken(token);
        const userId = decoded.userId;

        // 1. Total Questions (created by this teacher)
        const questionsCount = await Question.countDocuments({ teacherId: userId });

        // 2. Active Exams
        const activeExamsCount = await Exam.countDocuments({ teacherId: userId, isActive: true });

        // 3. Total Exams
        const totalExamsCount = await Exam.countDocuments({ teacherId: userId });

        // 4. Total Students (Results)
        // We can count total results, or unique students. Let's count total results for now.
        // Since exams verify teacher ownership, we need results for exams owned by this teacher.
        // This is a bit complex: Find active exams -> Find results for those exams.
        // Or simpler: Just count total results for now if the scale is small.
        // Better: Aggregation to filter by exam's teacherId.

        // Simpler Approach for MVP: Find all exams by teacher, then count results in those exams.
        const teacherExams = await Exam.find({ teacherId: userId }).select('_id');
        const examIds = teacherExams.map(e => e._id);
        const studentsCount = await Result.countDocuments({ examId: { $in: examIds } });

        return NextResponse.json({
            questions: questionsCount,
            activeExams: activeExamsCount,
            totalExams: totalExamsCount,
            students: studentsCount
        }, { status: 200 });

    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
