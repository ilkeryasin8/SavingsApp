import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Test kullanıcısı oluşturma fonksiyonu
async function getOrCreateTestUser() {
  const testUser = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (!testUser) {
    return await prisma.user.create({
      data: {
        email: 'test@example.com',
        monthlyTotal: 0,
      },
    });
  }

  return testUser;
}

// GET /api/goals
export async function GET() {
  try {
    const goals = await prisma.savingsGoal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

// POST /api/goals
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const goal = await prisma.savingsGoal.create({
      data: {
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: 0,
        monthlyPercentage: 0,
        monthlyAmount: 0,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}

// PUT /api/goals/:id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, currentAmount, monthlyPercentage, monthlyAmount } = body;

    const goal = await prisma.savingsGoal.update({
      where: { id },
      data: {
        currentAmount,
        monthlyPercentage,
        monthlyAmount,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
} 