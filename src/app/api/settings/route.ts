import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Fetch current user settings
export async function GET(req: Request) {
    try {
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });

        await connectDB();
        const user = await User.findById(decoded.userId).select('-password'); // Exclude password

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            schoolName: user.school || '',
            notifications: true, // Placeholder for now, can add to DB later
            defaultDuration: user.defaultDuration || 30,
            defaultGrade: user.defaultGrade || '',
            avatar: user.avatar || ''
        });

    } catch (error) {
        console.error('Settings GET Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT: Update user settings
export async function PUT(req: Request) {
    try {
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        if (!decoded) return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });

        const { name, schoolName, notifications, defaultDuration, defaultGrade, avatar } = await req.json();

        await connectDB();
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            {
                name,
                school: schoolName,
                defaultDuration,
                defaultGrade,
                avatar
                // notifications - add to schema if needed later
            },
            { new: true }
        ).select('-password');

        return NextResponse.json({
            message: 'Settings updated successfully',
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                schoolName: updatedUser.school,
                notifications,
                defaultDuration: updatedUser.defaultDuration,
                defaultGrade: updatedUser.defaultGrade,
                avatar: updatedUser.avatar
            }
        });

    } catch (error) {
        console.error('Settings PUT Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
