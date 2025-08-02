import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    console.warn('Google API Key or Custom Search Engine ID is not set. No image will be returned.');
    return NextResponse.json({ imageUrl: null });
  }

  try {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(`${name} restaurant`)}&searchType=image&num=1`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    let imageUrl = null; // Default to null if no image found

    const imageRegex = /\.(jpeg|jpg|png|gif|bmp|webp)$/i;

    if (data.items && data.items.length > 0) {
      const foundImage = data.items.find((item: any) => imageRegex.test(item.link));
      if (foundImage) {
        imageUrl = foundImage.link;
      } else {
        console.warn(`No valid image format found for "${name}".`);
      }
    } else {
      console.warn(`No image found for "${name}".`);
    }

    console.log(imageUrl);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error fetching image from Google Custom Search API:', error);
    return NextResponse.json({ imageUrl: null }); // Return null on error
  }
}