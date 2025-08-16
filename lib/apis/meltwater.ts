import axios from 'axios';

const MELTWATER_API_KEY = process.env.MELTWATER_API_KEY;
const MELTWATER_BASE_URL = 'https://api.meltwater.com/v1/mentions';

export async function fetchMeltwaterMentions() {
  try {
    const res = await axios.get(MELTWATER_BASE_URL, {
      headers: { Authorization: `Bearer ${MELTWATER_API_KEY}` },
      params: { limit: 100 },
    });
    return res.data.mentions || [];
  } catch (e: any) {
    // Log error, handle rate limiting, etc.
    return [];
  }
}
