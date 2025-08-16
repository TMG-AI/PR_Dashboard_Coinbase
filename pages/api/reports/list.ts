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
    const { page = 1, pageSize = 10, type } = req.query;
    const where: any = {};
    if (type) where.type = type;
    const total = await prisma.report.count({ where });
    const reports = await prisma.report.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });
    res.status(200).json({ reports, total });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
