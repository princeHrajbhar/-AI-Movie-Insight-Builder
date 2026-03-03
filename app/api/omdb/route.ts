import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imdbId = searchParams.get("id");

  if (!imdbId) {
    return NextResponse.json(
      { error: "IMDb ID is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OMDB_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`
    );

    const data = await res.json();

    if (data.Response === "False") {
      return NextResponse.json(
        { error: data.Error },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}