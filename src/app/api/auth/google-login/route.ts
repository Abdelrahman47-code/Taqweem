import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ message: 'Missing token' }, { status: 400 });
        }

        // Verify token with Google
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const googleData = await googleRes.json();

        if (googleData.error || !googleData.email) {
            return NextResponse.json({ message: 'Invalid Google Token' }, { status: 401 });
        }

        const { email, name, picture } = googleData;

        await connectDB();

        // Find or Create User
        let user = await User.findOne({ email });

        if (!user) {
            // Create new teacher account
            // Random password since they use Google
            const randomPassword = Math.random().toString(36).slice(-8);

            user = await User.create({
                name,
                email,
                password: randomPassword, // Ideally hash this, but for purely social login accounts it matters less, still good practice to hash in real app.
                role: 'teacher',
                avatar: picture
            });
        } else {
            // Update avatar if missing
            if (!user.avatar && picture) {
                user.avatar = picture;
                await user.save();
            }
        }

        // Generate Session Token
        const authToken = signToken({ userId: user._id, email: user.email, role: user.role });

        // Set Cookie
        cookies().set('token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({ message: 'Login successful' });

    } catch (error) {
        console.error('Google Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
