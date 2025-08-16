import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function analyzeSentiment(content: string) {
  try {
    const res = await axios.post(
      OPENAI_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a PR analyst. Analyze the following content for sentiment (positive, neutral, negative), topics, and crisis indicators. Return JSON.' },
          { role: 'user', content },
        ],
        temperature: 0.2,
      },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      }
    );
    // Parse response for sentiment, topics, crisis
    const text = res.data.choices[0].message.content;
    return JSON.parse(text);
  } catch (e: any) {
    // Log error, handle rate limiting, etc.
    return { sentiment: 'neutral', topics: [], crisis: false };
  }
}
