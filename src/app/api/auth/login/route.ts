import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password, isGuest } = await request.json();

    await connectDB();
    let user;

    if (isGuest) {
      const guestName = 'guest_demo';
      user = await User.findOne({ username: guestName });
      if (!user) {
        user = await User.create({ username: guestName });
      }
    } else {
      if (!username || !password) {
        return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
      }
      user = await User.findOne({ username: username.toLowerCase() });
      
      if (!user) {
         return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      } else {
        // Legacy claim
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
      }
    }

    const token = await signJWT({ userId: user._id.toString() });
    const cookieStore = await cookies();
    cookieStore.set('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });

    return NextResponse.json({ success: true, user: { username: user.username } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
