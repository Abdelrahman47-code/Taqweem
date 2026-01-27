import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exam from '@/models/Exam';
import Question from '@/models/Question';
import { isValidObjectId } from 'mongoose';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        let query = {};
        if (isValidObjectId(params.id)) {
            query = { _id: params.id };
        } else {
            query = { code: params.id.toUpperCase() }; // Case insensitive logic
        }

        // Fetch exam
        const exam = await Exam.findOne(query).populate('questions', 'text options type subject skill difficulty');

        if (!exam) {
            return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
        }

        // If fetching by Code (Student), check if active
        if (!isValidObjectId(params.id)) {
            if (!exam.isActive) {
                return NextResponse.json({ message: 'Exam is closed' }, { status: 403 });
            }
        }

        return NextResponse.json({ exam }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const token = cookies().get('token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await connectDB();

        const updatedExam = await Exam.findByIdAndUpdate(params.id, body, { new: true });

        if (!updatedExam) {
            return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Exam updated', exam: updatedExam }, { status: 200 });
    } catch (error) {
        console.error('Update Exam Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
