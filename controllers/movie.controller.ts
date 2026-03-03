import puppeteer, { Page } from 'puppeteer';
import { Review, ReviewSummary } from '@/types';

export class ScraperService {
  async scrapeReviews(imdbId: string, limit: number = 20): Promise<{ reviews: Review[]; summary: ReviewSummary }> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();

      // Set realistic browser properties
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Set extra headers to avoid detection
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      });

      await page.goto(`https://www.imdb.com/title/${imdbId}/reviews`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for review cards to load
      await page.waitForSelector('[data-testid="review-card-parent"]', { timeout: 10000 });

      // Scroll to load more reviews if needed
      await this.scrollForMoreReviews(page, limit);

      const reviews = await page.evaluate((limit: number): Review[] => {
        const reviewCards = document.querySelectorAll('[data-testid="review-card-parent"]');
        
        return Array.from(reviewCards).slice(0, limit).map(card => {
          // Get rating value
          const ratingElement = card.querySelector('.ipc-rating-star--rating');
          const rating = ratingElement ? ratingElement.textContent : null;
          
          // Get max rating
          const maxRatingElement = card.querySelector('.ipc-rating-star--maxRating');
          const maxRating = maxRatingElement ? maxRatingElement.textContent?.replace('/', '').trim() : null;
          
          // Get rating aria label
          const ratingStarElement = card.querySelector('[class*="rating-star"]');
          const ratingAriaLabel = ratingStarElement ? ratingStarElement.getAttribute('aria-label') : null;
          
          // Get review title
          const titleElement = card.querySelector('[data-testid="review-summary"] h3');
          const title = titleElement ? titleElement.textContent : null;
          
          // Get review text
          const textElement = card.querySelector('.ipc-html-content-inner-div');
          const text = textElement ? textElement.textContent?.trim() : null;
          
          // Get helpful count
          const helpfulElement = card.querySelector('.ipc-voting__label__count--up');
          let helpful = helpfulElement ? helpfulElement.textContent : '0';
          if (helpful && helpful.includes('K')) {
            helpful = Math.round(parseFloat(helpful) * 1000).toString();
          } else if (helpful && helpful.includes('M')) {
            helpful = Math.round(parseFloat(helpful) * 1000000).toString();
          }
          
          // Get not helpful count
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

      const summary: ReviewSummary = {
        totalReviews: reviews.length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length 
          : 0,
        totalHelpful: reviews.reduce((acc, review) => acc + review.helpful, 0),
        totalNotHelpful: reviews.reduce((acc, review) => acc + review.notHelpful, 0)
      };

      return { reviews, summary };
    } finally {
      await browser.close();
    }
  }

  private async scrollForMoreReviews(page: Page, targetCount: number): Promise<void> {
    let previousHeight: number = 0;
    let currentReviews = 0;

    while (currentReviews < targetCount) {
      // Check for and click "Load more" button
      const loadMoreButton = await page.$('.ipc-see-more__button');
      if (loadMoreButton) {
        await loadMoreButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Get current scroll height with type assertion
      previousHeight = await page.evaluate(() => document.body.scrollHeight) as number;
      
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get new height with type assertion
      const newHeight = await page.evaluate(() => document.body.scrollHeight) as number;
      
      // Get current review count
      currentReviews = await page.$$eval('[data-testid="review-card-parent"]', 
        (els: Element[]) => els.length
      );

      // Check if we've reached the bottom and no more load button
      if (newHeight === previousHeight && !loadMoreButton) {
        break;
      }
    }
  }
}