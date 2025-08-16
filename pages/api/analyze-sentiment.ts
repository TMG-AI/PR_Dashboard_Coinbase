import type { NextApiRequest, NextApiResponse } from 'next';
import { analyzeSentiment } from '../../lib/apis/openai';
import prisma from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Find mentions with unknown sentiment
    const mentions = await prisma.mention.findMany({ where: { sentiment: 'unknown' }, take: 100 });
    let updated = 0;
    for (const mention of mentions) {
      const analysis = await analyzeSentiment(mention.content);
      await prisma.mention.update({
        where: { id: mention.id },
        data: {
          sentiment: analysis.sentiment,
          sentimentScore: analysis.sentiment_score || 0,
          topics: analysis.topics || [],
        },
      });
      // If crisis, create alert
      if (analysis.crisis) {
        await prisma.alert.create({
          data: {
            level: 'critical',
            title: 'Crisis Detected',
            description: mention.content,
            source: mention.platform,
            triggeredAt: new Date(),
          },
        });
      }
      updated++;
    }
    res.status(200).json({ status: 'success', updated });
  } catch (e: any) {
    res.status(500).json({ status: 'error', error: e.message });
  }
}
