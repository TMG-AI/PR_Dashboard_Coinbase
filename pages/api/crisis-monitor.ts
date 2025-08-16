import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check for volume spike in last hour
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const mentions = await prisma.mention.findMany({ where: { timestamp: { gte: oneHourAgo } } });
    const negativeMentions = mentions.filter((m) => m.sentiment === 'negative');
    // Simple crisis detection logic
    if (negativeMentions.length > 20) {
      await prisma.alert.create({
        data: {
          level: 'critical',
          title: 'Negative Sentiment Spike',
          description: `Detected ${negativeMentions.length} negative mentions in the last hour`,
          source: 'Automated Monitor',
          triggeredAt: now,
        },
      });
      // TODO: Escalation (email, Slack, SMS)
    }
    res.status(200).json({ status: 'success', checked: mentions.length });
  } catch (e: any) {
    res.status(500).json({ status: 'error', error: e.message });
  }
}
