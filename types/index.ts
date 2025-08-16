export interface Metric {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export interface Mention {
  id: string;
  source: 'Twitter' | 'Reddit' | 'News' | 'Blog';
  time: string;
  user: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  reach: number;
}

export interface Sentiment {
  positive: number;
  neutral: number;
  negative: number;
}

export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  latestMention: string;
}

export interface CrisisAlert {
  id: string;
  level: AlertSeverity;
  title: string;
  description: string;
  time: string;
  source?: AlertSource;
  resolved?: boolean;
  expanded?: boolean;
}

export interface MediaCoverage {
  id: string;
  time: string;
  publication: string;
  headline: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  reach: number;
}

export interface CompetitorData {
  name: string;
  mentions: number;
}

export interface Topic {
  name: string;
  count: number;
}

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'green' | 'yellow' | 'red';
export type AlertSource = 'System' | 'Twitter' | 'Reddit' | 'News' | 'Blog';

export interface FilterState {
  dateRange: '24h' | '7d' | '30d' | 'custom';
  platform: AlertSource | 'All';
  sentiment: 'all' | 'positive' | 'negative';
  search: string;
}

export type ExportType = 'pdf' | 'csv' | 'excel';
