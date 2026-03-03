import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🔵 [START] /api/final-analysis");

  const { searchParams } = new URL(req.url);
  const imdbId = searchParams.get("id");

  if (!imdbId) {
    return NextResponse.json(
      { error: "IMDb ID is required" },
      { status: 400 }
    );
  }

  try {
    // 🚀 Fetch both APIs in parallel
    const [omdbRes, sentimentRes] = await Promise.all([
      fetch(`http://localhost:3000/api/omdb?id=${imdbId}`),
      fetch(`http://localhost:3000/api/analyze-sentiment?id=${imdbId}`)
    ]);

    const omdb = await omdbRes.json();
    const sentiment = await sentimentRes.json();

    if (!omdb || omdb.Response === "False") {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    // 🧠 Ensure sentiment fallback
    const sentimentAnalysis = sentiment?.sentimentAnalysis || {
      summary: "No audience analysis available.",
      overallSentiment: "neutral",
      score: 0
    };

    // 🎬 FINAL CLEAN RESPONSE (NO DUPLICATES)
    const finalResponse = {
      imdbId,

      movie: {
        title: omdb.Title,
        poster: omdb.Poster,
        releaseYear: omdb.Year,
        rated: omdb.Rated,
        runtime: omdb.Runtime,
        genre: omdb.Genre
      },

      cast: omdb.Actors?.split(", ").map((actor: string) => actor.trim()),

      plot: omdb.Plot,

      audienceAI: {
        summary: sentimentAnalysis.summary,
        sentiment: sentimentAnalysis.overallSentiment, // positive / neutral / negative
        score: sentimentAnalysis.score
      },

      reviewStats: sentiment?.reviewSummary || null,

      generatedAt: new Date().toISOString()
    };

    console.log("🟢 Final structured analysis ready");

    return NextResponse.json(finalResponse);

  } catch (error: any) {
    console.error("🔴 ERROR in final-analysis:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}