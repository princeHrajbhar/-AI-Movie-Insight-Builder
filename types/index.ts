export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  BoxOffice: string;
  Response: string;
}

export interface Review {
  title: string | null;
  rating: number | null;
  maxRating: number;
  ratingAriaLabel: string | null;
  text: string | null;
  helpful: number;
  notHelpful: number;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  totalHelpful: number;
  totalNotHelpful: number;
}

export interface SentimentResult {
  sentiment: "Positive" | "Negative" | "Neutral" | "Mixed";
  score: number;
  summary: string;
}

export interface MovieData {
  imdbId: string;
  movieDetails: MovieDetails;
  reviews: Review[];
  reviewSummary: ReviewSummary;
  sentimentAnalysis: SentimentResult;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieResponse {
  success: boolean;
  data?: MovieData;
  error?: string;
  fromCache?: boolean;
}