// components/MovieCard.tsx
import { FC } from 'react';
import Image from 'next/image';
import { Star, Calendar, Clock, Users, Award, Film } from 'lucide-react';

interface MovieCardProps {
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
}

const MovieCard: FC<MovieCardProps> = ({ imdbId, movie }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Poster Section */}
        <div className="relative h-[400px] md:h-full min-h-[400px] bg-gray-900">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-mono text-purple-400 border border-purple-500/30">
            {imdbId}
          </div>
        </div>

        {/* Movie Details */}
        <div className="md:col-span-2 p-6 space-y-6">
          {/* Title and Ratings */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="px-3 py-1 bg-gray-700 rounded-full text-gray-300">{movie.year}</span>
              <span className="px-3 py-1 bg-gray-700 rounded-full text-gray-300">{movie.rated}</span>
              <span className="px-3 py-1 bg-gray-700 rounded-full text-gray-300">{movie.runtime}</span>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <div>
                <span className="text-2xl font-bold text-white">{movie.imdbRating}</span>
                <span className="text-gray-400 text-sm ml-1">/10</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              <Users className="w-4 h-4 inline mr-1" />
              {movie.imdbVotes} votes
            </div>
          </div>

          {/* Plot */}
          <p className="text-gray-300 leading-relaxed">{movie.plot}</p>

          {/* Movie Info Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Released</p>
                  <p className="text-white">{movie.released}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Film className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Genre</p>
                  <p className="text-white">{movie.genre}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Award className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Director</p>
                  <p className="text-white">{movie.director}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Writer</p>
                <p className="text-white">{movie.writer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Actors</p>
                <p className="text-white">{movie.actors}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;