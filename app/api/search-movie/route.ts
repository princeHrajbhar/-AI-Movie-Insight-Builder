import { NextRequest, NextResponse } from "next/server";

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("name");

  if (!query) {
    return NextResponse.json(
      { error: "Movie name is required" },
      { status: 400 }
    );
  }

  try {
    // 🔎 Search movie by name
    const searchRes = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`
    );

    const searchData = await searchRes.json();

    if (!searchData.Search || !searchData.Search.length) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    // 🎯 Take first match
    const imdbId = searchData.Search[0].imdbID;

    // 🔥 Call your final-analysis API
    const finalRes = await fetch(
      `http://localhost:3000/api/final-analysis?id=${imdbId}`
    );

    const finalData = await finalRes.json();

    return NextResponse.json(finalData);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}