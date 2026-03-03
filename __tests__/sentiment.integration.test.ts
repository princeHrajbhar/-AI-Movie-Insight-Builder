import { analyzeAudienceSentiment } from "@/services/sentiment.service";

describe("Gemini Sentiment (Integration Test)", () => {
  it(
    "should analyze sentiment and print result",
    async () => {
      const reviews = [
        "This movie was absolutely amazing and mind-blowing.",
        "The acting was great but the story felt slow.",
        "I loved the visuals and soundtrack!"
      ];

      const result = await analyzeAudienceSentiment(reviews);

      // ✅ Assertions
      expect(result).toHaveProperty("summary");
      expect(result).toHaveProperty("overallSentiment");
      expect(result).toHaveProperty("score");

      // 🔥 Print Result
      console.log("===== SENTIMENT RESULT =====");
      console.log(result);
    },
    30000
  );
});