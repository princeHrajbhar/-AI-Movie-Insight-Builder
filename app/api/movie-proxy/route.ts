import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Movie ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`http://13.62.47.101:3000/api/movie?id=${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from external API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie data' },
      { status: 500 }
    );
  }
}