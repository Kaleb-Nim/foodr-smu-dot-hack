import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const food = await prisma.food.findMany();
    return NextResponse.json(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    return NextResponse.json({ error: 'Failed to fetch food' }, { status: 500 });
  }
}