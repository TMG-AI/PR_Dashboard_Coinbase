import { DashboardData } from './realtime';

let cachedData: DashboardData | null = null;
let lastFetch = 0;
let connectionStatus: 'connected' | 'error' | 'connecting' | 'mock' = 'mock';

const SHEET_RANGE = 'Sheet1';

// Example mock data for fallback
const mockDashboardData: DashboardData = {
  metrics: [
    { title: 'Total Mentions Today', value: 1842, change: 12, trend: 'up', color: '' },
    { title: 'Sentiment Score', value: '68%', change: -3, trend: 'down', color: '' },
    { title: 'Reach/Impressions', value: '2.4M', change: 8, trend: 'up', color: '' },
    { title: 'Crisis Alert Level', value: 'Green', color: 'text-green-400' },
  ],
  mentionVolume: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(60 + Math.random() * 80 + (i > 12 ? 40 : 0)),
  })),
  sentiment: {
    positive: 62,
    neutral: 25,
    negative: 13,
  },
  topics: [
    { name: 'bitcoin', count: 32 },
    { name: 'regulation', count: 21 },
    { name: 'CBbase', count: 18 },
    { name: 'crypto', count: 15 },
    { name: 'SEC', count: 13 },
    { name: 'listing', count: 11 },
    { name: 'Binance', count: 10 },
    { name: 'Kraken', count: 8 },
    { name: 'Gemini', count: 7 },
  ],
  crisisAlerts: [
    { id: '1', level: 'green', title: 'No major incidents', description: 'All systems normal. No PR crises detected in the last 24 hours.', time: '09:00 AM', source: 'System', resolved: false },
    { id: '2', level: 'high', title: 'Regulatory Rumor', description: 'Unconfirmed reports of new SEC investigation. Monitoring closely.', time: '07:30 AM', source: 'News', resolved: false },
    { id: '3', level: 'critical', title: 'Negative Press Spike', description: 'Sudden surge in negative sentiment from major news outlets.', time: '06:10 AM', source: 'News', resolved: false },
  ],
  influencers: [
    { id: '1', name: 'CryptoCobain', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', followers: 420000, latestMention: 'Coinbase is leading the way in compliance.' },
    { id: '2', name: 'Laura Shin', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', followers: 180000, latestMention: 'Interesting move by Coinbase in the NFT space.' },
    { id: '3', name: 'Pomp', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', followers: 1200000, latestMention: 'Coinbase quarterly results are out. Impressive growth.' },
  ],
  competitorData: [
    { name: 'Binance', mentions: 1320 },
    { name: 'Kraken', mentions: 980 },
    { name: 'Gemini', mentions: 670 },
  ],
  mediaCoverage: [
    { id: '1', time: '08:45 AM', publication: 'Bloomberg', headline: 'Coinbase Surges After Earnings Beat', url: 'https://bloomberg.com', sentiment: 'positive', reach: 1200000 },
    { id: '2', time: '08:10 AM', publication: 'TechCrunch', headline: 'Coinbase Launches New NFT Platform', url: 'https://techcrunch.com', sentiment: 'neutral', reach: 800000 },
    { id: '3', time: '07:50 AM', publication: 'Reuters', headline: 'SEC Eyes Crypto Exchanges', url: 'https://reuters.com', sentiment: 'negative', reach: 950000 },
    { id: '4', time: '07:20 AM', publication: 'The Verge', headline: 'Coinbase Expands to Europe', url: 'https://theverge.com', sentiment: 'positive', reach: 600000 },
    { id: '5', time: '06:55 AM', publication: 'Forbes', headline: 'Coinbase CEO on Regulation', url: 'https://forbes.com', sentiment: 'neutral', reach: 400000 },
  ],
};

export async function fetchDashboardData(): Promise<{ data: DashboardData | null; status: string; error?: string }> {
  // Move environment variable declarations inside the function
  const SHEET_ID = process.env.GOOGLE_SHEETS_SHEET_ID;
  const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
  
  if (API_KEY && SHEET_ID) {
    connectionStatus = 'connecting';
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch Google Sheet');
      const json = await res.json();
      const rows = json.values;
      if (!rows || rows.length < 2) throw new Error('No data in sheet');
      // Parse header
      const [header, ...dataRows] = rows;
      // Map rows to objects
      const records = dataRows.map((row: string[]) => {
        const obj: any = {};
        header.forEach((h: string, i: number) => {
          obj[h] = row[i];
        });
        return obj;
      });
      // TODO: Map records to dashboardData fields
      const dashboardData: DashboardData = mockDashboardData; // fallback to mock for now
      cachedData = dashboardData;
      lastFetch = Date.now();
      connectionStatus = 'connected';
      return { data: dashboardData, status: 'connected' };
    } catch (e: any) {
      console.warn('[Google Sheets] Error fetching data, using mock data:', e.message);
      connectionStatus = 'mock';
      return { data: mockDashboardData, status: 'mock', error: e.message };
    }
  } else {
    if (typeof window !== 'undefined') {
      console.warn('[Google Sheets] GOOGLE_SHEETS_API_KEY or GOOGLE_SHEETS_SHEET_ID not set. Using mock data.');
    }
    connectionStatus = 'mock';
    return { data: mockDashboardData, status: 'mock' };
  }
}

export function getConnectionStatus() {
  return connectionStatus;
}