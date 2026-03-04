import { NextRequest, NextResponse } from "next/server";

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("name");

  console.log("1. Search query:", query);

  if (!query) {
    return NextResponse.json(
      { error: "Movie name is required" },
      { status: 400 }
    );
  }

  if (!OMDB_API_KEY) {
    console.error("2. OMDB_API_KEY is missing");
    return NextResponse.json(
      { error: "OMDB API key is not configured" },
      { status: 500 }
    );
  }

  try {
    // 🔎 Search movie by name
    console.log("3. Calling OMDB API with query:", query);
    const searchRes = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`
    );

    console.log("4. OMDB API response status:", searchRes.status);
    
    if (!searchRes.ok) {
      throw new Error(`OMDB API responded with ${searchRes.status}`);
    }

    const searchData = await searchRes.json();
    console.log("5. OMDB API response:", searchData);

    if (!searchData.Search || !searchData.Search.length) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    // 🎯 Take first match
    const imdbId = searchData.Search[0].imdbID;
    console.log("6. Found IMDB ID:", imdbId);

    // 🔥 Call your final-analysis API
    console.log("7. Calling external API for ID:", imdbId);
    const finalRes = await fetch(
      `http://13.62.47.101:3000/api/movie?id=${imdbId}`
    );

    console.log("8. External API response status:", finalRes.status);
    
    if (!finalRes.ok) {
      const errorText = await finalRes.text();
      console.error("9. External API error response:", errorText);
      return NextResponse.json(
        { error: "External API error", details: errorText },
        { status: finalRes.status }
      );
    }

    const finalData = await finalRes.json();
    console.log("10. External API data received successfully");
    
    return NextResponse.json(finalData);

  } catch (error: any) {
    console.error("11. Error caught:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}