import { NextRequest, NextResponse } from 'next/server';

/**
 * A simple "echo" endpoint to verify that POST requests are being received correctly.
 * It takes any JSON body and sends it back as part of the response.
 */
export async function POST(request: NextRequest) {
  let requestBody;

  try {
    // Try to parse the JSON body from the request.
    requestBody = await request.json();
  } catch (error) {
    // If the body is not valid JSON or is empty, assign null.
    requestBody = null;
  }

  // Return a successful response that includes what we received.
  return NextResponse.json(
    {
      status: 'ok',
      message: 'Server is running and received your POST request.',
      timestamp: new Date().toISOString(),
      echo: requestBody, // This will show you exactly what the server received.
    },
    { status: 200 }
  );
}