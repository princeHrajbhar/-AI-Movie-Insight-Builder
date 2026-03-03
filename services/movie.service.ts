import Movie from "@/models/Movie";
import { fetchMovieDetails } from "./omdb.service";
import { fetchReviews } from "./review.service";
import { analyzeAudienceSentiment } from "./sentiment.service";

export async function analyzeMovie(imdbId: string) {
  if (!imdbId) {
    throw new Error("IMDb ID is required");
  }

  // 1️⃣ Check cache first
  const existing = await Movie.findOne({ imdbId });
  if (existing) return existing;

  // 2️⃣ Fetch movie details from OMDB
  const details = await fetchMovieDetails(imdbId);

  // 3️⃣ Fetch reviews (NEW STRUCTURE)
  const reviewResponse = await fetchReviews(imdbId, 20);

  const { reviews, summary: reviewSummary } = reviewResponse;

  // 4️⃣ Run sentiment analysis ONLY on review texts
  const sentiment = await analyzeAudienceSentiment(
    reviews.map((r) => r.text || "")
  );

  // 5️⃣ Save everything to DB
  const movie = await Movie.create({
    imdbId,
    title: details.Title,
    poster: details.Poster,
    year: details.Year,
    rated: details.Rated,
    cast: details.Actors.split(",").map((a: string) => a.trim()),
    plot: details.Plot,

    // 🔥 Store review analytics
    reviewSummary: {
      totalReviews: reviewSummary.totalReviews,
      averageRating: reviewSummary.averageRating,
      totalHelpful: reviewSummary.totalHelpful,
      totalNotHelpful: reviewSummary.totalNotHelpful,
    },

    // 🔥 AI Sentiment
    audienceSentimentSummary: sentiment.summary,
    overallSentiment: sentiment.overallSentiment,
    sentimentScore: sentiment.score,
  });

  return movie;
}