import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const { code } = params;

  if (!code) {
    return NextResponse.json({ message: 'Group code is required' }, { status: 400 });
  }

  try {
    const group = await prisma.group.findUnique({
      where: {
        code: code,
      },
    });

    if (group) {
      return NextResponse.json({ exists: true, groupName: group.name }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false, message: 'Group not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error checking group existence:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}