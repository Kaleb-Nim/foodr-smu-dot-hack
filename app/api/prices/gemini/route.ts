import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const { placeName, placeAmenity } = await request.json();

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error('Gemini API key not configured.');
    return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
  }
  console.log('Gemini API Key loaded:', !!geminiApiKey); // Log if key is present

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Suggest a price range for "${placeName}" which is a ${placeAmenity}. Provide a range of prices, for example, a hawker might be $0-$10, a restaurant might be $10-$20. Only provide the price range`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const priceRange = response.text().trim();
    return NextResponse.json({ priceRange });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to get price range from Gemini API.' }, { status: 500 });
  }
}