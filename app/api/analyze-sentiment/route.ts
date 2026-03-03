import { NextRequest, NextResponse } from "next/server";
import { analyzeAudienceSentiment } from "@/services/sentiment.service";

export async function GET(req: NextRequest) {
  console.log("🔵 [START] /api/analyze-sentiment");

  const { searchParams } = new URL(req.url);
  const imdbId = searchParams.get("id");

  console.log("🟡 IMDb ID Received:", imdbId);

  if (!imdbId) {
    console.log("🔴 IMDb ID missing");
    return NextResponse.json(
      { error: "IMDb ID is required" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ Fetch reviews
    console.log("🟡 Fetching reviews...");
    const reviewRes = await fetch(
      `http://localhost:3000/api/reviews?id=${imdbId}`
    );

    console.log("🟢 Reviews API status:", reviewRes.status);

    const reviewData = await reviewRes.json();
    console.log("🟢 Reviews fetched successfully");
    console.log("🟢 Total reviews:", reviewData?.reviews?.length);

    if (!reviewData.reviews || !reviewData.reviews.length) {
      console.log("🟠 No reviews found");
      return NextResponse.json({
        summary: "No reviews available",
        overallSentiment: "neutral",
        score: 0,
      });
    }

    // 2️⃣ Extract review texts
    console.log("🟡 Extracting review texts...");
    const reviewTexts = reviewData.reviews.map((r: any) => r.text);
    console.log("🟢 Extracted review texts count:", reviewTexts.length);

    // 3️⃣ Send to Gemini
    console.log("🟡 Sending reviews to Gemini...");
    const startTime = Date.now();

    const sentiment = await analyzeAudienceSentiment(reviewTexts);

    const endTime = Date.now();
    console.log("🟢 Gemini response received");
    console.log("⏱ Gemini response time:", endTime - startTime, "ms");
    console.log("🟢 Sentiment result:", sentiment);

    // 4️⃣ Return final result
    console.log("🟢 Returning final response");

    return NextResponse.json({
      imdbId,
      reviewSummary: reviewData.summary,
      sentimentAnalysis: sentiment,
    });

  } catch (error: any) {
    console.error("🔴 ERROR in analyze-sentiment:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}