import axios from 'axios';

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_SECRET = process.env.REDDIT_SECRET;
const REDDIT_USER_AGENT = 'CoinbasePRBot/1.0';

async function getRedditToken() {
  const res = await axios.post('https://www.reddit.com/api/v1/access_token',
    'grant_type=client_credentials',
    {
      auth: { username: REDDIT_CLIENT_ID, password: REDDIT_SECRET },
      headers: { 'User-Agent': REDDIT_USER_AGENT },
    }
  );
  return res.data.access_token;
}

export async function fetchRedditMentions(subreddit = 'CryptoCurrency', query = 'Coinbase', limit = 100) {
  try {
    const token = await getRedditToken();
    const res = await axios.get(`https://oauth.reddit.com/r/${subreddit}/search`, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': REDDIT_USER_AGENT },
      params: { q: query, limit, sort: 'new', restrict_sr: 1 },
    });
    return res.data.data.children.map((c: any) => c.data) || [];
  } catch (e: any) {
    // Log error, handle rate limiting, etc.
    return [];
  }
}
