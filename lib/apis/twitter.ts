import axios from 'axios';

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const TWITTER_SEARCH_URL = 'https://api.twitter.com/2/tweets/search/recent';

export async function fetchTwitterMentions(query = 'Coinbase', maxResults = 100) {
  try {
    const res = await axios.get(TWITTER_SEARCH_URL, {
      headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
      params: {
        query,
        max_results: maxResults,
        tweet_fields: 'created_at,author_id,text,public_metrics',
      },
    });
    return res.data.data || [];
  } catch (e: any) {
    // Log error, handle rate limiting, etc.
    return [];
  }
}
