import { fetchReviews } from "@/services/review.service";

describe("IMDb Review Scraper (Integration Test)", () => {
  it(
    "should fetch and print reviews successfully",
    async () => {
      const imdbId = "tt0133093"; // The Matrix

      const data = await fetchReviews(imdbId, 5);

      // ✅ Basic Assertions
      expect(data).toHaveProperty("summary");
      expect(data).toHaveProperty("reviews");
      expect(Array.isArray(data.reviews)).toBe(true);
      expect(data.reviews.length).toBeGreaterThan(0);

      // 🔥 PRINT OBTAINED DATA
      console.log("===== REVIEW SUMMARY =====");
      console.log(data.summary);

      console.log("===== FIRST REVIEW =====");
      console.log(data.reviews[0]);

      console.log("===== TOTAL REVIEWS FETCHED =====");
      console.log(data.reviews.length);
    },
    60000 // ⏳ Increase timeout for puppeteer
  );
});