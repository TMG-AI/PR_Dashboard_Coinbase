import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // DB check
    await prisma.$queryRaw`SELECT 1`;
    // TODO: Add checks for external APIs if needed
    res.status(200).json({ status: 'ok', db: 'ok' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', error: e.message });
  }
}
