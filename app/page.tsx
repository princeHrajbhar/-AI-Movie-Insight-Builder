// app/page.tsx
'use client';

import { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import AudienceInsight from '@/components/AudienceInsight';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface MovieData {
  imdbId: string;
  movie: {
    title: string;
    year: string;
    rated: string;
    released: string;
    runtime: string;
    genre: string;
    director: string;
    writer: string;
    actors: string;
    plot: string;
    poster: string;
    imdbRating: string;
    imdbVotes: string;
  };
  audienceInsight: {
    overallSentiment: string;
    score: number;
    positivePercentage: number;
    neutralPercentage: number;
    negativePercentage: number;
    averageUserRating: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    emotionalTone: string;
  };
  generatedAt: string;
}

export default function Home() {
  const [movieId, setMovieId] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeMovie = async () => {
    if (!movieId.trim()) {
      setError('Please enter a movie ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/movie-by-id?id=${movieId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie data');
      }
      
      const data = await response.json();
      setMovieData(data);
    } catch (err) {
      setError('Failed to analyze movie. Please check the ID and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Movie Audience Insights
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Enter an IMDb movie ID to analyze audience sentiment and get deep insights about the film's reception
          </p>
        </div>

        {/* Search Section */}
        <SearchBar 
          movieId={movieId}
          setMovieId={setMovieId}
          onAnalyze={analyzeMovie}
          loading={loading}
        />

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Results */}
        {movieData && !loading && (
          <div className="space-y-8 animate-fade-in">
            <MovieCard movie={movieData.movie} imdbId={movieData.imdbId} />
            <AudienceInsight insight={movieData.audienceInsight} />
            
            {/* Generated At Timestamp */}
            <div className="text-center text-sm text-gray-500">
              Analysis generated: {new Date(movieData.generatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}