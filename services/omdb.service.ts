export async function fetchMovieDetails(imdbId: string) {
  const apiKey = process.env.OMDB_API_KEY!;

  const res = await fetch(
    `http://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`
  );

  if (!res.ok) throw new Error("OMDb fetch failed");

  return res.json();
}