import puppeteer from "puppeteer";

/* ============================= */
/* Interfaces */
/* ============================= */

export interface Review {
  title: string | null;
  rating: number | null;
  maxRating: number;
  ratingAriaLabel: string | null;
  text: string | null;
  helpful: number;
  notHelpful: number;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  totalHelpful: number;
  totalNotHelpful: number;
}

export interface ReviewsResponse {
  summary: ReviewSummary;
  reviews: Review[];
}

/* ============================= */
/* Service Function */
/* ============================= */

export async function fetchReviews(
  imdbId: string,
  limit: number = 10
): Promise<ReviewsResponse> {

  if (!imdbId) {
    throw new Error("IMDb ID is required");
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );

    await page.goto(`https://www.imdb.com/title/${imdbId}/reviews`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    await page.waitForSelector('[data-testid="review-card-parent"]', {
      timeout: 10000,
    });

    const reviews: Review[] = await page.evaluate((limit: number) => {
      const reviewCards = document.querySelectorAll(
        '[data-testid="review-card-parent"]'
      );

      return Array.from(reviewCards)
        .slice(0, limit)
        .map((card) => {
          const ratingElement = card.querySelector(
            ".ipc-rating-star--rating"
          );
          const rating = ratingElement
            ? ratingElement.textContent
            : null;

          const maxRatingElement = card.querySelector(
            ".ipc-rating-star--maxRating"
          );
          const maxRating = maxRatingElement
            ? maxRatingElement.textContent?.replace("/", "").trim()
            : null;

          const ratingStarElement = card.querySelector(
            '[class*="rating-star"]'
          );
          const ratingAriaLabel = ratingStarElement
            ? ratingStarElement.getAttribute("aria-label")
            : null;

          const titleElement = card.querySelector(
            '[data-testid="review-summary"] h3'
          );
          const title = titleElement
            ? titleElement.textContent
            : null;

          const textElement = card.querySelector(
            ".ipc-html-content-inner-div"
          );
          const text = textElement
            ? textElement.textContent?.trim()
            : null;

          const helpfulElement = card.querySelector(
            ".ipc-voting__label__count--up"
          );
          let helpful = helpfulElement
            ? helpfulElement.textContent
            : "0";

          if (helpful?.includes("K")) {
            helpful = Math.round(
              parseFloat(helpful) * 1000
            ).toString();
          } else if (helpful?.includes("M")) {
            helpful = Math.round(
              parseFloat(helpful) * 1000000
            ).toString();
          }

          const notHelpfulElement = card.querySelector(
            ".ipc-voting__label__count--down"
          );
          let notHelpful = notHelpfulElement
            ? notHelpfulElement.textContent
            : "0";

          if (notHelpful?.includes("K")) {
            notHelpful = Math.round(
              parseFloat(notHelpful) * 1000
            ).toString();
          } else if (notHelpful?.includes("M")) {
            notHelpful = Math.round(
              parseFloat(notHelpful) * 1000000
            ).toString();
          }

          return {
            title: title || null,
            rating: rating ? parseInt(rating, 10) : null,
            maxRating: maxRating ? parseInt(maxRating, 10) : 10,
            ratingAriaLabel: ratingAriaLabel || null,
            text: text || null,
            helpful: helpful ? parseInt(helpful, 10) : 0,
            notHelpful: notHelpful
              ? parseInt(notHelpful, 10)
              : 0,
          };
        })
        .filter((review) => review.text !== null);
    }, limit);

    const summary: ReviewSummary = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? reviews.reduce(
              (acc, review) =>
                acc + (review.rating || 0),
              0
            ) / reviews.length
          : 0,
      totalHelpful: reviews.reduce(
        (acc, review) => acc + review.helpful,
        0
      ),
      totalNotHelpful: reviews.reduce(
        (acc, review) => acc + review.notHelpful,
        0
      ),
    };

    return { summary, reviews };
  } finally {
    await browser.close();
  }
}