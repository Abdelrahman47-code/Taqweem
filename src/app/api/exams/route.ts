import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exam from '@/models/Exam';
// import Question from '@/models/Question'; // Might be needed if we validate questions
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const token = cookies().get('token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { title, subject, grade, questions, timeLimit } = await req.json();

        if (!title || !subject || !questions || questions.length === 0) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        // Get user from token to assign teacherId
        const decoded: any = verifyToken(token);

        // Generate Short Code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newExam = await Exam.create({
            title,
            subject,
            grade,
            questions,
            teacherId: decoded.userId,
            isActive: true,
            timeLimit: timeLimit || 0,
            code
        });

        return NextResponse.json({ message: 'Exam created', id: newExam._id, code }, { status: 201 });
    } catch (error) {
        console.error('Create Exam Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const token = cookies().get('token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const decoded: any = verifyToken(token);

        // Fetch exams created by this teacher
        const exams = await Exam.find({ teacherId: decoded.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ exams }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching exams' }, { status: 500 });
    }
}
