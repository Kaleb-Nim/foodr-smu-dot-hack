import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { redis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  const { foodName } = await request.json();

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error('Gemini API key not configured.');
    return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `What is the primary cuisine of "${foodName}"? Respond with only the cuisine name (e.g., "Italian", "Chinese", "Mexican", "Mixed" if it's a fusion or hard to categorize).`;

  const cacheKey = `cuisine:${foodName}`;
  try {
    const cachedCuisine = await redis.get(cacheKey);
    if (cachedCuisine) {
      console.log('Serving cuisine from cache:', cacheKey);
      return NextResponse.json({ cuisine: cachedCuisine });
    }
  } catch (cacheError) {
    console.error('Redis cache read error:', cacheError);
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cuisine = response.text().trim();

    try {
      await redis.setex(cacheKey, 24 * 60 * 60, cuisine); // Cache for 24 hours
    } catch (cacheError) {
      console.error('Redis cache write error:', cacheError);
    }

    return NextResponse.json({ cuisine });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to get cuisine from Gemini API.' }, { status: 500 });
  }
}