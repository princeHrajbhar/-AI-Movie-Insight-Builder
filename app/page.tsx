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
  const [searchType, setSearchType] = useState<'name' | 'id'>('name');
  const [searchValue, setSearchValue] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeMovie = async () => {
    if (!searchValue.trim()) {
      setError(searchType === 'name' ? 'Please enter a movie name' : 'Please enter a movie ID');
      return;
    }

    setLoading(true);
    setError('');
    setMovieData(null);
    
    try {
      const endpoint = searchType === 'name' 
        ? `/api/search-movie?name=${encodeURIComponent(searchValue)}`
        : `/api/movie-proxy?id=${encodeURIComponent(searchValue)}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch movie data');
      }
      
      const data = await response.json();
      setMovieData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze movie. Please try again.');
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
            Search by movie name or enter an IMDb ID to analyze audience sentiment and get deep insights about the film's reception
          </p>
        </div>

        {/* Search Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 flex gap-1">
            <button
              onClick={() => {
                setSearchType('name');
                setSearchValue('');
                setError('');
              }}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                searchType === 'name'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Search by Name
            </button>
            <button
              onClick={() => {
                setSearchType('id');
                setSearchValue('');
                setError('');
              }}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                searchType === 'id'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Search by IMDb ID
            </button>
          </div>
        </div>

        {/* Search Section */}
        <SearchBar 
          searchType={searchType}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
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