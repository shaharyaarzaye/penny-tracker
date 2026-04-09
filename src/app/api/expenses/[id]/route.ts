import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { amount, category, date, note } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(amount !== undefined && { amount }),
        ...(category !== undefined && { category }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(note !== undefined && { note }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) return NextResponse.json({ success: false, error: 'Not found or unauthorized' }, { status: 404 });
    return NextResponse.json({ success: true, data: updatedExpense });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });
    if (!deletedExpense) return NextResponse.json({ success: false, error: 'Not found or unauthorized' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
