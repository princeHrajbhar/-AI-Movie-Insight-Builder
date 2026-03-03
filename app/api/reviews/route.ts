import puppeteer from "puppeteer";

// Define the review interface
interface Review {
  title: string | null;
  rating: number | null;
  maxRating: number;
  ratingAriaLabel: string | null;
  text: string | null;
  helpful: number;
  notHelpful: number;
}

// Define the summary interface
interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  totalHelpful: number;
  totalNotHelpful: number;
}

// Define the response interface
interface ReviewsResponse {
  summary: ReviewSummary;
  reviews: Review[];
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get("id");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10;

  if (!imdbId) {
    return Response.json({ error: "IMDb ID required" }, { status: 400 });
  }

  const browser = await puppeteer.launch({ 
    headless: true, // Use true instead of "new" for TypeScript compatibility
    args: ['--no-sandbox']
  });
  
  try {
    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto(`https://www.imdb.com/title/${imdbId}/reviews`, {
      waitUntil: "networkidle2",
      timeout: 30000
    });

    // Wait for review cards to load
    await page.waitForSelector('[data-testid="review-card-parent"]', { timeout: 10000 });

    const reviews = await page.evaluate((limit: number): Review[] => {
      // Select all review cards using the stable data-testid attribute
      const reviewCards = document.querySelectorAll('[data-testid="review-card-parent"]');
      
      return Array.from(reviewCards).slice(0, limit).map(card => {
        // Get rating value
        const ratingElement = card.querySelector('.ipc-rating-star--rating');
        const rating = ratingElement ? ratingElement.textContent : null;
        
        // Get max rating (usually /10)
        const maxRatingElement = card.querySelector('.ipc-rating-star--maxRating');
        const maxRating = maxRatingElement ? maxRatingElement.textContent?.replace('/', '').trim() : null;
        
        // Get full rating text from aria-label
        const ratingStarElement = card.querySelector('[class*="rating-star"]');
        const ratingAriaLabel = ratingStarElement ? ratingStarElement.getAttribute('aria-label') : null;
        
        // Get review title
        const titleElement = card.querySelector('[data-testid="review-summary"] h3');
        const title = titleElement ? titleElement.textContent : null;
        
        // Get review text
        const textElement = card.querySelector('.ipc-html-content-inner-div');
        const text = textElement ? textElement.textContent?.trim() : null;
        
        // Get helpful (up votes) count
        const helpfulElement = card.querySelector('.ipc-voting__label__count--up');
        let helpful = helpfulElement ? helpfulElement.textContent : '0';
        // Convert K/M suffixes to numbers (e.g., 1.2K -> 1200)
        if (helpful && helpful.includes('K')) {
          helpful = Math.round(parseFloat(helpful) * 1000).toString();
        } else if (helpful && helpful.includes('M')) {
          helpful = Math.round(parseFloat(helpful) * 1000000).toString();
        }
        
        // Get not helpful (down votes) count
        const notHelpfulElement = card.querySelector('.ipc-voting__label__count--down');
        let notHelpful = notHelpfulElement ? notHelpfulElement.textContent : '0';
        if (notHelpful && notHelpful.includes('K')) {
          notHelpful = Math.round(parseFloat(notHelpful) * 1000).toString();
        } else if (notHelpful && notHelpful.includes('M')) {
          notHelpful = Math.round(parseFloat(notHelpful) * 1000000).toString();
        }
        
        return {
          title: title || null,
          rating: rating ? parseInt(rating, 10) : null,
          maxRating: maxRating ? parseInt(maxRating, 10) : 10,
          ratingAriaLabel: ratingAriaLabel || null,
          text: text || null,
          helpful: helpful ? parseInt(helpful, 10) : 0,
          notHelpful: notHelpful ? parseInt(notHelpful, 10) : 0
        };
      }).filter((review): review is Review => review.text !== null);
    }, limit);

    // Calculate summary statistics
    const summary: ReviewSummary = {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length 
        : 0,
      totalHelpful: reviews.reduce((acc, review) => acc + review.helpful, 0),
      totalNotHelpful: reviews.reduce((acc, review) => acc + review.notHelpful, 0)
    };
    
    const response: ReviewsResponse = {
      summary,
      reviews
    };
    
    return Response.json(response);
    
  } catch (error) {
    console.error('Error scraping reviews:', error);
    return Response.json(
      { error: 'Failed to scrape reviews' }, 
      { status: 500 }
    );
  } finally {
    await browser.close();
  }
}