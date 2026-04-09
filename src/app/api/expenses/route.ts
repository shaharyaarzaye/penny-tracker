import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');

    const filter: any = { userId };

    if (period) {
      const now = new Date();
      switch (period) {
        case 'today':
          filter.date = { $gte: startOfDay(now), $lte: endOfDay(now) };
          break;
        case 'week':
          filter.date = { $gte: startOfWeek(now, { weekStartsOn: 1 }), $lte: endOfWeek(now, { weekStartsOn: 1 }) };
          break;
        case 'month':
          filter.date = { $gte: startOfMonth(now), $lte: endOfMonth(now) };
          break;
      }
    } else if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = endOfDay(new Date(endDate));
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 }).lean();
    return NextResponse.json({ success: true, data: expenses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { amount, category, date, note } = body;

    if (!amount || amount <= 0) return NextResponse.json({ success: false, error: 'Valid amount is required' }, { status: 400 });
    if (!category) return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 });

    const expense = await Expense.create({
      userId,
      amount,
      category,
      date: date ? new Date(date) : new Date(),
      note: note || '',
    });

    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 });
  }
}
