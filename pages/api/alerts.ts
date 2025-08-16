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
    const { resolved = false, level, dateFrom, dateTo } = req.query;
    const where: any = { resolved: resolved === 'true' };
    if (level) where.level = level;
    if (dateFrom || dateTo) {
      where.triggeredAt = {};
      if (dateFrom) where.triggeredAt.gte = new Date(dateFrom as string);
      if (dateTo) where.triggeredAt.lte = new Date(dateTo as string);
    }
    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { triggeredAt: 'desc' },
      take: 50,
    });
    res.status(200).json({ alerts });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
