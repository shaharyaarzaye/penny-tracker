import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).lean();
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: user.categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { category } = await request.json();
    if (!category || category.trim() === '') {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    await connectDB();
    const cleanCategory = category.trim();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { categories: cleanCategory } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedUser?.categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add category' }, { status: 500 });
  }
}
