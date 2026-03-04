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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-x-hidden">
      {/* Animated background elements - adjusted for mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-20 sm:left-40 w-60 sm:w-80 h-60 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header - responsive text sizes */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 px-2">
            Movie Audience Insights
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Search by movie name or enter an IMDb ID to analyze audience sentiment and get deep insights about the film's reception
          </p>
        </div>

        {/* Search Type Toggle - responsive buttons */}
        <div className="flex justify-center mb-4 sm:mb-6 px-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 flex flex-col sm:flex-row w-full sm:w-auto gap-1">
            <button
              onClick={() => {
                setSearchType('name');
                setSearchValue('');
                setError('');
              }}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base transition-all duration-200 w-full sm:w-auto ${
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
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base transition-all duration-200 w-full sm:w-auto ${
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
        <div className="px-4">
          <SearchBar 
            searchType={searchType}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onAnalyze={analyzeMovie}
            loading={loading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 mt-4">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Results */}
        {movieData && !loading && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in mt-8 px-4">
            <MovieCard movie={movieData.movie} imdbId={movieData.imdbId} />
            <AudienceInsight insight={movieData.audienceInsight} />
            
            {/* Generated At Timestamp */}
            <div className="text-center text-xs sm:text-sm text-gray-500">
              Analysis generated: {new Date(movieData.generatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Add these styles to your global CSS file or in a style tag */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}