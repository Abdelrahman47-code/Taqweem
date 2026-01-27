import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { generateQuestionsAI } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const token = cookies().get('token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { subject, skill, count, difficulty } = await req.json();

        if (!subject || !skill) {
            return NextResponse.json({ message: 'Missing subject or skill' }, { status: 400 });
        }

        const questions = await generateQuestionsAI(subject, skill, count || 3, difficulty || 'medium');

        return NextResponse.json({ questions }, { status: 200 });

    } catch (error) {
        console.error('API AI Gen Error:', error);
        return NextResponse.json({ message: 'Failed to generate questions' }, { status: 500 });
    }
}
