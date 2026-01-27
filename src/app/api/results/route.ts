import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Result from '@/models/Result';
import Exam from '@/models/Exam';
import Question from '@/models/Question';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { examId, studentName, studentGrade, studentId, studentEmail, answers } = await req.json();

        if (!examId || !studentName || !answers || !studentEmail) {
            return NextResponse.json({ message: 'Missing required fields (Email is required)' }, { status: 400 });
        }

        await connectDB();

        const exam = await Exam.findById(examId).populate('questions');
        if (!exam) {
            return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
        }

        let totalScore = 0;
        let maxScore = exam.questions.length;

        // Grade
        const gradedAnswers = exam.questions.map((q: any) => {
            const studentAns = answers[q._id] || '';
            const isCorrect = studentAns === q.correctAnswer;
            if (isCorrect) totalScore += 1;

            return {
                questionId: q._id,
                selectedAnswer: studentAns,
                isCorrect
            };
        });

        // Analysis
        const weaknesses = gradedAnswers
            .filter((a: any) => !a.isCorrect)
            .map((a: any) => {
                const q = exam.questions.find((eq: any) => eq._id.toString() === a.questionId.toString());
                return q?.skill;
            })
            .filter(Boolean);

        const strengths = gradedAnswers
            .filter((a: any) => a.isCorrect)
            .map((a: any) => {
                const q = exam.questions.find((eq: any) => eq._id.toString() === a.questionId.toString());
                return q?.skill;
            })
            .filter(Boolean);

        // Comparison Logic (By Email now)
        // Find the latest previous result for this studentEmail
        const previousResult = await Result.findOne({ studentEmail })
            .sort({ createdAt: -1 });

        let improvement = 0;
        if (previousResult) {
            // Calculate % score for fair comparison (in case maxScore differs)
            const previousPercentage = (previousResult.totalScore / previousResult.maxScore) * 100;
            const currentPercentage = (totalScore / maxScore) * 100;
            improvement = currentPercentage - previousPercentage;
        }

        // Save
        const result = await Result.create({
            examId,
            studentName,
            studentGrade,
            studentId: studentId || 'N/A', // Fallback if not provided
            studentEmail,
            answers: gradedAnswers,
            totalScore,
            maxScore,
            strengths: Array.from(new Set(strengths)),
            weaknesses: Array.from(new Set(weaknesses)),
            improvement
        });

        return NextResponse.json({
            message: 'Exam submitted successfully',
            resultId: result._id,
            score: totalScore,
            maxScore,
            improvement,
            feedback: gradedAnswers.map((g: any) => {
                const q = exam.questions.find((eq: any) => eq._id.toString() === g.questionId.toString());
                return {
                    questionId: g.questionId,
                    isCorrect: g.isCorrect,
                    userAnswer: g.selectedAnswer,
                    correctAnswer: q.correctAnswer // Reveal correct answer only after submission
                };
            })
        }, { status: 201 });

    } catch (error) {
        console.error('Submit Exam Error:', error);
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
        // Fetch all results
        const results = await Result.find({})
            .populate('examId', 'title subject')
            .sort({ createdAt: -1 });

        return NextResponse.json({ results }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching results' }, { status: 500 });
    }
}
