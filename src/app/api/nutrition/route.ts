import { NextResponse } from 'next/server';

const API_KEY = process.env.CALORIE_NINJAS_API_KEY;
const BASE_URL = 'https://api.calorieninjas.com/v1';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    console.error('API key is not defined in environment variables');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/nutrition?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'X-Api-Key': API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch nutrition data: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nutrition data' },
      { status: 500 }
    );
  }
} 