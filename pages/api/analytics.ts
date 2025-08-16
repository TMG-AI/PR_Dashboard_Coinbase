import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/database';

const RATE_LIMIT = 30;
const rateLimitMap: Record<string, { count: number; last: number }> = {};
function rateLimit(ip: string) {
  const now = Date.now();
  if (!rateLimitMap[ip] || now - rateLimitMap[ip].last > 60_000) {
    rateLimitMap[ip] = { count: 1, last: now };
    return false;
  }
  rateLimitMap[ip].count++;
  rateLimitMap[ip].last = now;
  return rateLimitMap[ip].count > RATE_LIMIT;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '';
  if (rateLimit(ip)) return res.status(429).json({ error: 'Rate limit exceeded' });
  try {
    const { dateFrom, dateTo, platform, sentiment } = req.query;
    const where: any = {};
    if (dateFrom || dateTo) {
      where.timestamp = {};
      if (dateFrom) where.timestamp.gte = new Date(dateFrom as string);
      if (dateTo) where.timestamp.lte = new Date(dateTo as string);
    }
    if (platform && platform !== 'All') where.platform = platform;
    if (sentiment && sentiment !== 'all') where.sentiment = sentiment;
    // Metrics
    const totalMentions = await prisma.mention.count({ where });
    const positive = await prisma.mention.count({ where: { ...where, sentiment: 'positive' } });
    const neutral = await prisma.mention.count({ where: { ...where, sentiment: 'neutral' } });
    const negative = await prisma.mention.count({ where: { ...where, sentiment: 'negative' } });
    // Mention volume (by hour)
    const mentionVolume = await prisma.$queryRawUnsafe<any[]>(
      `SELECT strftime('%H:00', timestamp) as hour, COUNT(*) as value FROM Mention WHERE timestamp >= ? AND timestamp <= ? GROUP BY hour ORDER BY hour`,
      dateFrom || '1970-01-01',
      dateTo || new Date().toISOString()
    );
    res.status(200).json({
      metrics: {
        totalMentions,
        sentiment: { positive, neutral, negative },
      },
      mentionVolume,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
