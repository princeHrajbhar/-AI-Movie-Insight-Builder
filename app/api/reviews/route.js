import puppeteer from "puppeteer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get("id");
  const limit = parseInt(searchParams.get("limit")) || 10; // Optional limit parameter

  if (!imdbId) {
    return Response.json({ error: "IMDb ID required" }, { status: 400 });
  }

  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  // Set a realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  await page.goto(`https://www.imdb.com/title/${imdbId}/reviews`, {
    waitUntil: "networkidle2",
    timeout: 30000
  });

  // Wait for review cards to load
  await page.waitForSelector('[data-testid="review-card-parent"]', { timeout: 10000 });

  const reviews = await page.evaluate((limit) => {
    // Select all review cards using the stable data-testid attribute
    const reviewCards = document.querySelectorAll('[data-testid="review-card-parent"]');
    
    return Array.from(reviewCards).slice(0, limit).map(card => {
      // Get rating value
      const ratingElement = card.querySelector('.ipc-rating-star--rating');
      const rating = ratingElement ? ratingElement.innerText : null;
      
      // Get max rating (usually /10)
      const maxRatingElement = card.querySelector('.ipc-rating-star--maxRating');
      const maxRating = maxRatingElement ? maxRatingElement.innerText.replace('/','').trim() : null;
      
      // Get full rating text from aria-label
      const ratingAriaLabel = card.querySelector('[class*="rating-star"]')?.getAttribute('aria-label') || null;
      
      // Get review title
      const titleElement = card.querySelector('[data-testid="review-summary"] h3');
      const title = titleElement ? titleElement.innerText : null;
      
      // Get review text
      const textElement = card.querySelector('.ipc-html-content-inner-div');
      const text = textElement ? textElement.innerText.trim() : null;
      
      // Get helpful (up votes) count
      const helpfulElement = card.querySelector('.ipc-voting__label__count--up');
      let helpful = helpfulElement ? helpfulElement.innerText : '0';
      // Convert K/M suffixes to numbers (e.g., 1.2K -> 1200)
      if (helpful.includes('K')) {
        helpful = Math.round(parseFloat(helpful) * 1000);
      } else if (helpful.includes('M')) {
        helpful = Math.round(parseFloat(helpful) * 1000000);
      }
      
      // Get not helpful (down votes) count
      const notHelpfulElement = card.querySelector('.ipc-voting__label__count--down');
      let notHelpful = notHelpfulElement ? notHelpfulElement.innerText : '0';
      if (notHelpful.includes('K')) {
        notHelpful = Math.round(parseFloat(notHelpful) * 1000);
      } else if (notHelpful.includes('M')) {
        notHelpful = Math.round(parseFloat(notHelpful) * 1000000);
      }
      
      return {
        title,
        rating: rating ? parseInt(rating) : null,
        maxRating: maxRating ? parseInt(maxRating) : 10,
        ratingAriaLabel,
        text,
        helpful: helpful ? parseInt(helpful) : 0,
        notHelpful: notHelpful ? parseInt(notHelpful) : 0
      };
    }).filter(review => review.text); // Only return reviews with text
  }, limit);

  await browser.close();
  
  // Optional: Calculate summary statistics
  const summary = {
    totalReviews: reviews.length,
    averageRating: reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length,
    totalHelpful: reviews.reduce((acc, review) => acc + review.helpful, 0),
    totalNotHelpful: reviews.reduce((acc, review) => acc + review.notHelpful, 0)
  };
  
  return Response.json({ 
    summary,
    reviews 
  });
}