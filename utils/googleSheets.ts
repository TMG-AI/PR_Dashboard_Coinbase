import { DashboardData } from './realtime';

let cachedData: DashboardData | null = null;
let lastFetch = 0;
let connectionStatus: 'connected' | 'error' | 'connecting' = 'connecting';

const SHEET_ID = process.env.GOOGLE_SHEETS_SHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_RANGE = 'Sheet1';

export async function fetchDashboardData(): Promise<{ data: DashboardData | null; status: string; error?: string }> {
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
    // Transform records to DashboardData (implement mapping logic here)
    // For now, just return mock structure for demo
    const dashboardData: DashboardData = {
      metrics: [],
      mentionVolume: [],
      sentiment: { positive: 0, neutral: 0, negative: 0 },
      topics: [],
      crisisAlerts: [],
      influencers: [],
      competitorData: [],
      mediaCoverage: [],
    };
    // TODO: Map records to dashboardData fields
    cachedData = dashboardData;
    lastFetch = Date.now();
    connectionStatus = 'connected';
    return { data: dashboardData, status: 'connected' };
  } catch (e: any) {
    connectionStatus = 'error';
    return { data: cachedData, status: 'error', error: e.message };
  }
}

export function getConnectionStatus() {
  return connectionStatus;
}
