import { fetchMovieDetails } from "@/services/omdb.service";

describe("OMDb Movie Details (Integration Test)", () => {
  it(
    "should fetch and print movie details successfully",
    async () => {
      const imdbId = "tt0133093"; // The Matrix

      const data = await fetchMovieDetails(imdbId);

      // ✅ Basic Assertions
      expect(data).toHaveProperty("Title");
      expect(data).toHaveProperty("Year");
      expect(data).toHaveProperty("Actors");
      expect(data).toHaveProperty("Plot");

      // 🔥 PRINT RESULT
      console.log("===== MOVIE DETAILS =====");
      console.log({
        Title: data.Title,
        Year: data.Year,
        Rated: data.Rated,
        Actors: data.Actors,
        Plot: data.Plot,
      });
    },
    20000 // timeout
  );
});