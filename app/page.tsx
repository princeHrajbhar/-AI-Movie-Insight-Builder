'use client';

import { useState } from 'react';

interface MovieData {
  imdbId: string;
  movie: {
    title: string;
    poster: string;
    releaseYear: string;
    rated: string;
    runtime: string;
    genre: string;
  };
  cast: string[];
  plot: string;
  audienceAI: {
    summary: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  };
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    totalHelpful: number;
    totalNotHelpful: number;
  };
  generatedAt: string;
}

type SearchType = 'name' | 'id';

export default function MovieAnalysisPage() {
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMovie = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a movie name or IMDb ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setData(null);

      // Determine which API endpoint to use based on search type
      const endpoint = searchType === 'name' 
        ? `/api/search-movie?name=${encodeURIComponent(searchValue)}`
        : `/api/final-analysis?id=${encodeURIComponent(searchValue)}`;

      const res = await fetch(endpoint);
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Something went wrong');

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchMovie();
    }
  };

  const sentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getPlaceholderText = () => {
    return searchType === 'name' 
      ? 'e.g., The Dark Knight, Inception, Avatar'
      : 'e.g., tt1375666, tt0468569, tt0499549';
  };

  // Helper function to safely format numbers
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return '0';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            🎬 CineAI Intelligence
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Get AI-powered insights, audience sentiment analysis, and comprehensive movie data
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-8 sm:mb-12 border border-gray-800">
          {/* Search Type Toggle */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
            <button
              onClick={() => {
                setSearchType('name');
                setSearchValue('');
                setError('');
              }}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all ${
                searchType === 'name'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🔍 Search by Name
            </button>
            <button
              onClick={() => {
                setSearchType('id');
                setSearchValue('');
                setError('');
              }}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all ${
                searchType === 'id'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🆔 Search by IMDb ID
            </button>
          </div>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={getPlaceholderText()}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base sm:text-lg placeholder-gray-500"
              />
              {searchType === 'id' && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 sm:hidden">
                  🆔
                </span>
              )}
            </div>
            <button
              onClick={fetchMovie}
              disabled={loading}
              className="px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition font-semibold text-base sm:text-lg shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <span className="hidden sm:inline">Movie</span>
                </>
              )}
            </button>
          </div>

          {/* Helper Text */}
          <p className="mt-3 text-xs sm:text-sm text-gray-500">
            {searchType === 'name' 
              ? '💡 Tip: Enter full movie name for best results'
              : '💡 Tip: IMDb ID format: tt1234567'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 sm:mb-8 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-center animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 animate-pulse">
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-2xl sm:rounded-3xl h-64 sm:h-96 w-full"></div>
            </div>
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="h-8 sm:h-10 bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 sm:h-6 bg-gray-800 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 sm:h-5 bg-gray-800 rounded"></div>
                <div className="h-4 sm:h-5 bg-gray-800 rounded"></div>
                <div className="h-4 sm:h-5 bg-gray-800 rounded w-3/4"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 sm:h-24 bg-gray-800 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Movie Data Display - WITH NULL CHECKS */}
        {data && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Poster Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <img
                  src={data.movie?.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt={data.movie?.title || 'Movie poster'}
                  className="rounded-2xl sm:rounded-3xl shadow-2xl w-full hover:scale-105 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
                  }}
                />
                
                {/* Quick Stats for Mobile */}
                <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
                  <div className="bg-gray-900 p-3 rounded-xl text-center border border-gray-800">
                    <p className="text-sm text-gray-400">Rating</p>
                    <p className="font-bold text-purple-400">{data.movie?.rated || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-xl text-center border border-gray-800">
                    <p className="text-sm text-gray-400">Runtime</p>
                    <p className="font-bold text-purple-400">{data.movie?.runtime || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-xl text-center border border-gray-800">
                    <p className="text-sm text-gray-400">Year</p>
                    <p className="font-bold text-purple-400">{data.movie?.releaseYear || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Title Section */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  {data.movie?.title || 'Unknown Title'}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-400">
                  <span className="hidden lg:inline">{data.movie?.releaseYear || 'N/A'}</span>
                  <span className="hidden lg:inline">•</span>
                  <span className="hidden lg:inline">{data.movie?.rated || 'N/A'}</span>
                  <span className="hidden lg:inline">•</span>
                  <span className="hidden lg:inline">{data.movie?.runtime || 'N/A'}</span>
                  <span className="lg:hidden">{data.movie?.genre || 'N/A'}</span>
                </div>
                <p className="text-purple-400 mt-1 text-base sm:text-lg hidden lg:block">
                  {data.movie?.genre || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  IMDb ID: {data.imdbId || 'N/A'}
                </p>
              </div>

              {/* Sentiment Card - WITH NULL CHECK */}
              {data.audienceAI && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-800">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>🎭 Audience Sentiment</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      data.audienceAI.sentiment === 'positive' ? 'bg-green-900/50 text-green-400' :
                      data.audienceAI.sentiment === 'negative' ? 'bg-red-900/50 text-red-400' :
                      'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {data.audienceAI.sentiment?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </h3>

                  <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {data.audienceAI.summary || 'No summary available'}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            data.audienceAI.sentiment === 'positive' ? 'bg-green-500' :
                            data.audienceAI.sentiment === 'negative' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${(data.audienceAI.score || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">
                        {((data.audienceAI.score || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Plot Section */}
              {data.plot && (
                <div className="bg-gray-900/50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-800">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>📝 Plot</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {data.plot}
                  </p>
                </div>
              )}

              {/* Cast Section */}
              {data.cast && data.cast.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                    <span>🎭 Cast</span>
                    <span className="text-xs text-gray-500">({data.cast.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.cast.map((actor, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-800/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-purple-600/80 transition border border-gray-700"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Stats - WITH NULL CHECK */}
              {data.reviewStats && (
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">📊 Review Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-gray-900 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-800 hover:border-purple-600 transition">
                      <p className="text-2xl sm:text-3xl font-bold text-purple-400">
                        {formatNumber(data.reviewStats.totalReviews)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Total Reviews</p>
                    </div>
                    <div className="bg-gray-900 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-800 hover:border-purple-600 transition">
                      <p className="text-2xl sm:text-3xl font-bold text-purple-400">
                        {data.reviewStats.averageRating ? Number(data.reviewStats.averageRating).toFixed(1) : '0.0'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Avg Rating</p>
                    </div>
                    <div className="bg-gray-900 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-800 hover:border-purple-600 transition">
                      <p className="text-2xl sm:text-3xl font-bold text-green-400">
                        {formatNumber(data.reviewStats.totalHelpful)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Helpful</p>
                    </div>
                    <div className="bg-gray-900 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-800 hover:border-purple-600 transition">
                      <p className="text-2xl sm:text-3xl font-bold text-red-400">
                        {formatNumber(data.reviewStats.totalNotHelpful)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Not Helpful</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Timestamp */}
              {data.generatedAt && (
                <p className="text-xs text-gray-600 text-right">
                  Analysis generated: {new Date(data.generatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="text-center py-12 sm:py-20">
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 opacity-20">🎬</div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-400 mb-2">
              Ready to analyze a movie?
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Search by movie name or IMDb ID to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}