// components/SearchBar.tsx
import { FC } from 'react';
import { Search, Film } from 'lucide-react';

interface SearchBarProps {
  movieId: string;
  setMovieId: (id: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const SearchBar: FC<SearchBarProps> = ({ movieId, setMovieId, onAnalyze, loading }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      onAnalyze();
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-1 border border-gray-700 shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Film className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter IMDb ID (e.g., tt0133093)"
              className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl sm:rounded-r-none text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={loading}
            />
          </div>
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl sm:rounded-l-none transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-400 text-center">
        Try: tt0133093 (The Matrix), tt0111161 (The Shawshank Redemption), tt0468569 (The Dark Knight)
      </p>
    </div>
  );
};

export default SearchBar;