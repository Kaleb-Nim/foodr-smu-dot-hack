import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const groupCode = params.code;

  if (!groupCode) {
    return NextResponse.json({ error: 'Group code is required' }, { status: 400 });
  }

  try {
    const group = await prisma.group.findUnique({
      where: {
        code: groupCode,
      },
      select: {
        hasStarted: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({ hasStarted: group.hasStarted }, { status: 200 });
  } catch (error) {
    console.error('Error checking group start status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}