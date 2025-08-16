import Parser from 'rss-parser';

const parser = new Parser();
const GOOGLE_NEWS_RSS = 'https://news.google.com/rss/search?q=Coinbase&hl=en-US&gl=US&ceid=US:en';

export async function fetchGoogleNews() {
  try {
    const feed = await parser.parseURL(GOOGLE_NEWS_RSS);
    return feed.items || [];
  } catch (e) {
    // Log error
    return [];
  }
}
