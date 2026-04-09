import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password, isGuest } = await request.json();

    await connectDB();

    let user;

    if (isGuest) {
      // Find or create guest user
      const guestName = 'guest_demo';
      user = await User.findOne({ username: guestName });
      if (!user) {
        user = await User.create({ username: guestName });
      }
    } else {
      if (!username || username.trim().length === 0) {
        return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
      }
      if (!password || password.trim().length === 0) {
        return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
      }

      user = await User.findOne({ username: username.toLowerCase() });

      if (!user) {
        // Register new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ username: username.toLowerCase(), password: hashedPassword });
      } else {
        // Login existing user
        if (!user.password) {
          // Legacy user, hash their newly provided password to upgrade their account
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          await user.save();
        } else {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
          }
        }
      }
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('userId', user._id.toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

    return NextResponse.json({ success: true, user: { id: user._id, username: user.username, categories: user.categories } });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Failed to authenticate' }, { status: 500 });
  }
}
