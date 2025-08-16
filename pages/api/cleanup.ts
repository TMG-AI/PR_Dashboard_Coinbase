import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const deletedMentions = await prisma.mention.deleteMany({ where: { timestamp: { lt: ninetyDaysAgo } } });
    const deletedAlerts = await prisma.alert.deleteMany({ where: { resolved: true, resolvedAt: { lt: thirtyDaysAgo } } });
    const deletedReports = await prisma.report.deleteMany({ where: { generatedAt: { lt: oneYearAgo } } });
    res.status(200).json({ status: 'success', deletedMentions, deletedAlerts, deletedReports });
  } catch (e: any) {
    res.status(500).json({ status: 'error', error: e.message });
  }
}
