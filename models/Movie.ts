import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  imdbId: string;
  title: string;
  poster: string;
  year: string;
  rated: string;
  cast: string[];
  plot: string;
  audienceSentimentSummary: string;
  overallSentiment: string;
  sentimentScore: number;
}

const MovieSchema = new Schema<IMovie>(
  {
    imdbId: { type: String, required: true, unique: true },
    title: String,
    poster: String,
    year: String,
    rated: String,
    cast: [String],
    plot: String,
    audienceSentimentSummary: String,
    overallSentiment: String,
    sentimentScore: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Movie ||
  mongoose.model<IMovie>("Movie", MovieSchema);