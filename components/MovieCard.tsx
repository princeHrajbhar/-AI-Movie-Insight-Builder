// components/MovieCard.tsx
import { ExternalLink, Star, Calendar, Clock, Users } from 'lucide-react';

interface MovieCardProps {
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
  imdbId: string;
}

export default function MovieCard({ movie, imdbId }: MovieCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Poster */}
        <div className="md:col-span-1">
          <div className="relative h-full min-h-[400px] md:min-h-full">
            <img
              src={movie.poster !== 'N/A' ? movie.poster : '/placeholder-poster.jpg'}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Movie Details */}
        <div className="md:col-span-2 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                  {movie.year}
                </span>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
                  {movie.rated}
                </span>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full flex items-center gap-1">
                  <Clock size={14} />
                  {movie.runtime}
                </span>
              </div>
            </div>
            
            {/* IMDb Link */}
            <a
              href={`https://www.imdb.com/title/${imdbId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors border border-yellow-500/30"
            >
              <span>IMDb</span>
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={24} />
              <span className="text-2xl font-bold text-white">{movie.imdbRating}</span>
            </div>
            <div className="text-gray-400">
              <span className="flex items-center gap-1">
                <Users size={16} />
                {movie.imdbVotes} votes
              </span>
            </div>
          </div>

          {/* Plot */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Plot</h3>
            <p className="text-gray-300 leading-relaxed">{movie.plot}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Director</h4>
              <p className="text-white">{movie.director}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Writer</h4>
              <p className="text-white">{movie.writer}</p>
            </div>
            <div className="col-span-2">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Actors</h4>
              <p className="text-white">{movie.actors}</p>
            </div>
            <div className="col-span-2">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Genre</h4>
              <p className="text-white">{movie.genre}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}