import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchMeltwaterMentions } from '../../lib/apis/meltwater';
import { fetchTwitterMentions } from '../../lib/apis/twitter';
import { fetchGoogleNews } from '../../lib/apis/googleNews';
import { fetchRedditMentions } from '../../lib/apis/reddit';
import prisma, { createMention } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Collect from all sources
    const [meltwater, twitter, news, reddit] = await Promise.all([
      fetchMeltwaterMentions(),
      fetchTwitterMentions(),
      fetchGoogleNews(),
      fetchRedditMentions(),
    ]);
    // Normalize and store
    const allMentions = [
      ...meltwater.map((m: any) => ({
        timestamp: new Date(m.published_at || m.timestamp || Date.now()),
        platform: 'Meltwater',
        content: m.content || m.text,
        sentiment: 'unknown',
        sentimentScore: 0,
        reach: m.reach || 0,
        authorHandle: m.author || m.author_handle || '',
        publication: m.publication || '',
        headline: m.headline || '',
        type: 'news',
        topics: [],
        influencer: false,
      })),
      ...twitter.map((t: any) => ({
        timestamp: new Date(t.created_at),
        platform: 'Twitter',
        content: t.text,
        sentiment: 'unknown',
        sentimentScore: 0,
        reach: t.public_metrics?.impression_count || 0,
        authorHandle: t.author_id,
        publication: '',
        headline: '',
        type: 'social',
        topics: [],
        influencer: false,
      })),
      ...news.map((n: any) => ({
        timestamp: new Date(n.pubDate || n.isoDate || Date.now()),
        platform: 'Google News',
        content: n.contentSnippet || n.title,
        sentiment: 'unknown',
        sentimentScore: 0,
        reach: 0,
        authorHandle: '',
        publication: n.source || n.creator || '',
        headline: n.title,
        type: 'news',
        topics: [],
        influencer: false,
      })),
      ...reddit.map((r: any) => ({
        timestamp: new Date((r.created_utc || Date.now()) * 1000),
        platform: 'Reddit',
        content: r.title + '\n' + (r.selftext || ''),
        sentiment: 'unknown',
        sentimentScore: 0,
        reach: r.score || 0,
        authorHandle: r.author,
        publication: '',
        headline: r.title,
        type: 'community',
        topics: [],
        influencer: false,
      })),
    ];
    // Store in DB
    for (const mention of allMentions) {
      await createMention(mention);
    }
    res.status(200).json({ status: 'success', count: allMentions.length });
  } catch (e: any) {
    res.status(500).json({ status: 'error', error: e.message });
  }
}
