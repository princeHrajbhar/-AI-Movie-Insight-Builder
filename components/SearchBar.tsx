// components/SearchBar.tsx
import { Search, Film } from 'lucide-react';

interface SearchBarProps {
  searchType: 'name' | 'id';
  searchValue: string;
  setSearchValue: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export default function SearchBar({ 
  searchType, 
  searchValue, 
  setSearchValue, 
  onAnalyze, 
  loading 
}: SearchBarProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  const getPlaceholder = () => {
    return searchType === 'name' 
      ? 'e.g., Inception, The Dark Knight, Avatar...'
      : 'e.g., tt1375666, tt0468569, tt0499549...';
  };

  const getExample = () => {
    return searchType === 'name'
      ? 'Try: "Inception", "The Dark Knight", "Avatar"'
      : 'Try: tt1375666 (Inception), tt0468569 (Dark Knight)';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute left-4 text-gray-400">
            {searchType === 'name' ? <Search size={20} /> : <Film size={20} />}
          </div>
          
          {/* Input Field */}
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full pl-12 pr-36 py-4 bg-gray-800/80 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
          />
          
          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </form>
      
      {/* Helper Text */}
      <p className="text-sm text-gray-500 text-center mt-4">
        {getExample()}
      </p>
    </div>
  );
}