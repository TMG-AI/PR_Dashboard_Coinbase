import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/database';

const RATE_LIMIT = 30; // max 30 requests per minute per IP (simple in-memory)
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
    const { page = 1, pageSize = 20, dateFrom, dateTo, platform, sentiment, search } = req.query;
    const where: any = {};
    if (dateFrom || dateTo) {
      where.timestamp = {};
      if (dateFrom) where.timestamp.gte = new Date(dateFrom as string);
      if (dateTo) where.timestamp.lte = new Date(dateTo as string);
    }
    if (platform && platform !== 'All') where.platform = platform;
    if (sentiment && sentiment !== 'all') where.sentiment = sentiment;
    if (search) where.content = { contains: search, mode: 'insensitive' };
    const total = await prisma.mention.count({ where });
    const mentions = await prisma.mention.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });
    res.status(200).json({ mentions, total });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
