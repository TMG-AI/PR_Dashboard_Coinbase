import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/database';
import { analyzeSentiment } from '../../lib/apis/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Gather data for report
    const mentions = await prisma.mention.findMany({ where: { timestamp: { gte: new Date(Date.now() - 24*60*60*1000) } } });
    const summary = await analyzeSentiment(
      mentions.map((m) => m.content).join('\n')
    );
    // Stub PDF generation
    const pdfUrl = '/reports/daily-report.pdf';
    await prisma.report.create({
      data: {
        type: 'daily',
        summary: JSON.stringify(summary),
        pdfUrl,
        competitorAnalysis: '',
      },
    });
    res.status(200).json({ status: 'success', pdfUrl });
  } catch (e: any) {
    res.status(500).json({ status: 'error', error: e.message });
  }
}
