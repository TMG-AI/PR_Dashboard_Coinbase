import { Metric, Sentiment, CrisisAlert, Influencer, MediaCoverage, CompetitorData, Topic } from '../types';

export interface DashboardData {
  metrics: Metric[];
  mentionVolume: { time: string; value: number }[];
  sentiment: Sentiment;
  topics: Topic[];
  crisisAlerts: CrisisAlert[];
  influencers: Influencer[];
  competitorData: CompetitorData[];
  mediaCoverage: MediaCoverage[];
}

function randomDelta(val: number, percent = 0.1) {
  const delta = val * percent * (Math.random() - 0.5);
  return Math.round(val + delta);
}

export function simulateRealtimeData(prev: DashboardData): DashboardData {
  // Metrics
  const metrics = prev.metrics.map((m) => {
    if (typeof m.value === 'number') {
      const newValue = randomDelta(m.value as number, 0.08);
      const change = ((newValue - (m.value as number)) / (m.value as number)) * 100;
      return { ...m, value: newValue, change: Math.round(change), trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral' };
    }
    return m;
  });

  // Mention volume
  const mentionVolume = prev.mentionVolume.map((d) => ({ ...d, value: randomDelta(d.value, 0.15) }));

  // Sentiment
  let total = 100;
  let positive = Math.max(10, Math.min(80, prev.sentiment.positive + Math.round((Math.random() - 0.5) * 4)));
  let neutral = Math.max(5, Math.min(60, prev.sentiment.neutral + Math.round((Math.random() - 0.5) * 3)));
  let negative = total - positive - neutral;
  if (negative < 0) { negative = 0; neutral = total - positive; }
  const sentiment = { positive, neutral, negative };

  // Topics
  const topics = prev.topics.map((t) => ({ ...t, count: randomDelta(t.count, 0.2) }));

  // Crisis Alerts (simulate new or resolved alerts)
  let crisisAlerts = [...prev.crisisAlerts];
  if (Math.random() < 0.15) {
    // Add a new alert
    crisisAlerts = [
      {
        id: Date.now().toString(),
        level: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any,
        title: 'Simulated Alert',
        description: 'A new simulated alert has been triggered.',
        time: new Date().toLocaleTimeString(),
        source: 'System',
      },
      ...crisisAlerts,
    ];
  } else if (crisisAlerts.length > 0 && Math.random() < 0.1) {
    // Resolve an alert
    crisisAlerts = crisisAlerts.slice(1);
  }

  // Influencers
  const influencers = prev.influencers.map((i) => ({
    ...i,
    followers: randomDelta(i.followers, 0.03),
    latestMention: i.latestMention,
  }));

  // Competitor Data
  const competitorData = prev.competitorData.map((c) => ({ ...c, mentions: randomDelta(c.mentions, 0.12) }));

  // Media Coverage (simulate new articles)
  let mediaCoverage = [...prev.mediaCoverage];
  if (Math.random() < 0.12) {
    mediaCoverage = [
      {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        publication: 'Simulated News',
        headline: 'Simulated headline for new media coverage.',
        url: '#',
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any,
        reach: randomDelta(1000000, 0.5),
      },
      ...mediaCoverage,
    ];
  }

  return {
    metrics,
    mentionVolume,
    sentiment,
    topics,
    crisisAlerts,
    influencers,
    competitorData,
    mediaCoverage,
  };
}
