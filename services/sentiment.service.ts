import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeAudienceSentiment(reviews: string[]) {
  if (!reviews.length) {
    return {
      summary: "No reviews available",
      overallSentiment: "neutral",
      score: 0,
    };
  }

  const combined = reviews.join("\n\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
Analyze the sentiment of the following movie reviews.

Return JSON in this format:
{
  "summary": "short summary",
  "overallSentiment": "positive | negative | neutral",
  "score": number between -1 and 1
}

Reviews:
${combined}
`;

 try {
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // 🔥 Remove markdown code blocks if present
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // 🔥 Extract only JSON object using regex (extra safety)
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No valid JSON found in Gemini response");
  }

  return JSON.parse(jsonMatch[0]);
} catch (error) {
  console.error("Gemini error:", error);

  return {
    summary: "Sentiment analysis failed due to high demand of gen api please try again!! ",
    overallSentiment: "neutral",
    score: 0,
  };
}
}