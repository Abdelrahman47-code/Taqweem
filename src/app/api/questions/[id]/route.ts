import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Fetch single question for editing
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const question = await Question.findById(params.id);
        if (!question) {
            return NextResponse.json({ message: 'Question not found' }, { status: 404 });
        }
        return NextResponse.json({ question }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Update question
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const token = cookies().get('token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await connectDB();

        const updatedQuestion = await Question.findByIdAndUpdate(params.id, body, { new: true });

        if (!updatedQuestion) {
            return NextResponse.json({ message: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Question updated', question: updatedQuestion }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const token = cookies().get('token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        await Question.findByIdAndDelete(params.id);

        return NextResponse.json({ message: 'Question deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
