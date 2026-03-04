import { NextRequest, NextResponse } from "next/server";
import { getMovieInsight } from "@/services/movie.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imdbId = searchParams.get("id");

    if (!imdbId) {
      return NextResponse.json(
        { error: "IMDb ID is required" },
        { status: 400 }
      );
    }

    const result = await getMovieInsight(imdbId);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Movie Insight API Error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server";
// import { analyzeAudienceSentiment } from "@/services/sentiment.service";

// export async function GET() {
//   try {
//     // 🔥 Dummy review data
//     const dummyReviews = [
//       {
//         text: "This movie was absolutely amazing. The visuals were stunning and the acting was brilliant.",
//         rating: 9
//       },
//       {
//         text: "Great storyline and strong emotional moments, but the pacing felt slightly slow in the middle.",
//         rating: 8
//       },
//       {
//         text: "It was decent, not the best in the franchise but still entertaining.",
//         rating: 6
//       },
//       {
//         text: "I didn't enjoy the ending. It felt rushed and underdeveloped.",
//         rating: 5
//       }
//     ];

//     const result = await analyzeAudienceSentiment(dummyReviews);

//     return NextResponse.json({
//       success: true,
//       data: result
//     });

//   } catch (error: any) {
//     console.error("Test Sentiment API Error:", error);

//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }



// import { NextResponse } from "next/server";
// import { getMovieById } from "@/services/omdb.service";

// export async function GET() {
//   try {
//     const movie = await getMovieById("tt0133093");
//     return NextResponse.json(movie);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message });
//   }
// }


// import { NextRequest, NextResponse } from "next/server";
// import { getReviewsById } from "@/services/review.service";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const imdbId = searchParams.get("id");
//     const limitParam = searchParams.get("limit");

//     if (!imdbId) {
//       return NextResponse.json(
//         { error: "IMDb ID is required" },
//         { status: 400 }
//       );
//     }

//     const limit = limitParam ? parseInt(limitParam, 10) : 5;

//     const result = await getReviewsById(imdbId, limit);

//     return NextResponse.json(result);

//   } catch (error: any) {
//     console.error("API Error:", error);

//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }