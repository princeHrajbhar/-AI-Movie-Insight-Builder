import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { analyzeMovie } from "@/services/movie.service";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { imdbId } = await req.json();

    if (!imdbId) {
      return NextResponse.json(
        { error: "IMDb ID required" },
        { status: 400 }
      );
    }

    const result = await analyzeMovie(imdbId);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}