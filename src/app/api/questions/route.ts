import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const token = cookies().get('token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verifyToken(token);

        const body = await req.json();
        const { text, subject, skill, difficulty, correctAnswer, options } = body;

        // ... validation ...

        const newQuestion = await Question.create({
            text,
            subject,
            skill,
            difficulty,
            correctAnswer,
            options,
            grade: 'General',
            teacherId: decoded.userId
        });

        return NextResponse.json({ message: 'Question created', id: newQuestion._id }, { status: 201 });
    } catch (error) {
        console.error('Create Question Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        // Return all questions for now
        const questions = await Question.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ questions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch questions' }, { status: 500 });
    }
}
