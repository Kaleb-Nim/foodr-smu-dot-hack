import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
  }

  try {
    const value = await redis.get(key);
    return NextResponse.json({ value });
  } catch (error) {
    console.error('Redis cache read error:', error);
    return NextResponse.json({ error: 'Failed to read from cache' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { key, value, ex } = await request.json();

  if (!key || !value) {
    return NextResponse.json({ error: 'Missing key or value parameter' }, { status: 400 });
  }

  try {
    if (ex) {
      await redis.setex(key, ex, value);
    } else {
      await redis.set(key, value);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redis cache write error:', error);
    return NextResponse.json({ error: 'Failed to write to cache' }, { status: 500 });
  }
}