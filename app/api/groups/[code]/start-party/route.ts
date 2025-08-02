import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const groupCode = params.code;
  const { userId } = await request.json();

  if (!groupCode || !userId) {
    return NextResponse.json({ error: 'Group code and user ID are required' }, { status: 400 });
  }

  try {
    const group = await prisma.group.findUnique({
      where: {
        code: groupCode,
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.leader_id_fk !== userId) {
      return NextResponse.json({ error: 'Only the group leader can start the party' }, { status: 403 });
    }

    await prisma.group.update({
      where: {
        code: groupCode,
      },
      data: {
        hasStarted: true,
      },
    });

    return NextResponse.json({ message: 'Party started successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error starting party:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}