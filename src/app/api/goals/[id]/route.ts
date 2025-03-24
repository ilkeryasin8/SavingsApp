import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = context.params;

    const updatedGoal = await prisma.savingsGoal.update({
      where: { id },
      data: {
        monthlyPercentage: data.monthlyPercentage,
        monthlyAmount: data.monthlyAmount,
        currentAmount: data.currentAmount,
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const goal = await prisma.savingsGoal.findUnique({
      where: { id },
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    await prisma.savingsGoal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
} 