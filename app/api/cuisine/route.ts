import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cuisine = response.text().trim();
    return NextResponse.json({ cuisine });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to get cuisine from Gemini API.' }, { status: 500 });
  }
}