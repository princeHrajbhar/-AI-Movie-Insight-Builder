/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'm.media-amazon.com',
      'ia.media-imdb.com',
      'images-na.ssl-images-amazon.com',
      'image.tmdb.org',
      'themoviedb.org'
    ],
    
    // Optional: Add remote patterns for more control
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: '**.imdb.com',
      },
      {
        protocol: 'https',
        hostname: '**.tmdb.org',
      },
    ],
  },
}

module.exports = nextConfig