import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { MetricCard } from '../components/MetricCard';
import { LineChart } from '../components/LineChart';
import { PieChart } from '../components/PieChart';
import { AlertsPanel } from '../components/AlertsPanel';
import { InfluencerCard } from '../components/InfluencerCard';
import { MediaTable } from '../components/MediaTable';
import { CompetitorBarChart } from '../components/CompetitorBarChart';
import { TrendingTopics } from '../components/TrendingTopics';
import { DateRangePicker } from '../components/DateRangePicker';
import { FilterPanel } from '../components/FilterPanel';
import { AlertModal } from '../components/AlertModal';
import { ExportModal } from '../components/ExportModal';
import { MobileNavigation } from '../components/MobileNavigation';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { Metric, Sentiment, CrisisAlert, Influencer, MediaCoverage, CompetitorData, Topic, FilterState } from '../types';
import '@fontsource/inter/index.css';
import '../styles/globals.css';

const initialFilter: FilterState = {
  dateRange: '24h',
  platform: 'All',
  sentiment: 'all',
  search: '',
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [mentionVolume, setMentionVolume] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<Sentiment>({ positive: 0, neutral: 0, negative: 0 });
  const [topics, setTopics] = useState<Topic[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([]);
  const [mediaCoverage, setMediaCoverage] = useState<MediaCoverage[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [mediaPage, setMediaPage] = useState(1);
  const pageSize = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [alertModal, setAlertModal] = useState<{ open: boolean; alert: CrisisAlert | null }>({ open: false, alert: null });
  const [exportModal, setExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [liveBlink, setLiveBlink] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch dashboard data from APIs
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    setConnectionStatus('connecting');
    try {
      // Analytics (metrics, mention volume, sentiment)
      const analyticsRes = await fetch(`/api/analytics?dateFrom=&dateTo=&platform=${filter.platform}&sentiment=${filter.sentiment}`);
      if (!analyticsRes.ok) throw new Error('Failed to fetch analytics');
      const analytics = await analyticsRes.json();
      setMetrics(analytics.metrics);
      setMentionVolume(analytics.mentionVolume);
      setSentiment(analytics.metrics.sentiment);
      // Alerts
      const alertsRes = await fetch(`/api/alerts?resolved=false`);
      if (!alertsRes.ok) throw new Error('Failed to fetch alerts');
      const alerts = await alertsRes.json();
      setCrisisAlerts(alerts.alerts);
      // Reports
      const reportsRes = await fetch(`/api/reports/list?page=1&pageSize=5`);
      if (!reportsRes.ok) throw new Error('Failed to fetch reports');
      const reportsData = await reportsRes.json();
      setReports(reportsData.reports);
      // Mentions (for trending topics, influencers, media coverage)
      const mentionsRes = await fetch(`/api/mentions?page=1&pageSize=100&platform=${filter.platform}&sentiment=${filter.sentiment}`);
      if (!mentionsRes.ok) throw new Error('Failed to fetch mentions');
      const mentionsData = await mentionsRes.json();
      // Trending topics
      const topicMap: Record<string, number> = {};
      mentionsData.mentions.forEach((m: any) => {
        (m.topics || []).forEach((t: string) => {
          topicMap[t] = (topicMap[t] || 0) + 1;
        });
      });
      setTopics(Object.entries(topicMap).map(([name, count]) => ({ name, count })));
      // Influencers (top by reach)
      const influencerMap: Record<string, Influencer> = {};
      mentionsData.mentions.forEach((m: any) => {
        if (m.influencer) {
          influencerMap[m.authorHandle] = {
            id: m.authorHandle,
            name: m.authorHandle,
            avatar: '',
            followers: m.reach,
            latestMention: m.content,
          };
        }
      });
      setInfluencers(Object.values(influencerMap));
      // Media coverage (type: news)
      setMediaCoverage(mentionsData.mentions.filter((m: any) => m.type === 'news'));
      // Competitor data (stub for now)
      setCompetitorData([
        { name: 'Binance', mentions: 0 },
        { name: 'Kraken', mentions: 0 },
        { name: 'Gemini', mentions: 0 },
      ]);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setConnectionStatus('connected');
    } catch (e: any) {
      setError(e.message);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Initial and interval fetch
  useEffect(() => {
    fetchDashboardData();
    intervalRef.current = setInterval(() => {
      setPulse(true);
      setLiveBlink(true);
      setTimeout(() => setPulse(false), 1000);
      setTimeout(() => setLiveBlink(false), 2000);
      fetchDashboardData();
    }, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [filter]);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchDashboardData();
  };

  // Responsive: show mobile nav
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <>
      <Head>
        <title>Coinbase PR Command Center</title>
        <meta name="description" content="Enterprise PR Monitoring Dashboard for Coinbase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-[#0a0e1a] px-2 sm:px-4 py-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* MOBILE NAVIGATION */}
        <MobileNavigation>
          <FilterPanel filter={filter} onChange={setFilter} />
        </MobileNavigation>
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Image src="https://assets.brandfolder.com/3RTK8FAF/at/7q7v7q-7q7v7q/coinbase-logo.svg" alt="Coinbase Logo" width={40} height={40} />
            <h1 className="text-2xl font-bold text-white tracking-tight">PR Command Center</h1>
            <span className="flex items-center ml-6">
              <span className={`w-3 h-3 rounded-full mr-2 ${liveBlink ? 'bg-green-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="text-green-400 font-medium text-sm">Live</span>
            </span>
            <span className="ml-6 text-xs text-gray-400">Last updated: {lastUpdated}</span>
            <ConnectionStatus status={connectionStatus} />
            <button className="ml-4 px-3 py-1 rounded bg-[#0052FF] text-white text-xs font-semibold hover:bg-blue-700 transition" onClick={handleManualRefresh} disabled={loading}>
              {loading ? 'Refreshing...' : 'Manual Refresh'}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <DateRangePicker value={filter.dateRange} onChange={(val) => setFilter({ ...filter, dateRange: val })} />
            <FilterPanel filter={filter} onChange={setFilter} />
          </div>
          <div className="relative ml-auto">
            <button className="flex items-center gap-2 px-3 py-2 bg-[#10182b] rounded-lg shadow hover:bg-[#18213a] transition">
              <img src="/icons/user.svg" alt="User" className="w-8 h-8 rounded-full border-2 border-[#0052FF] object-cover" />
              <span className="text-white font-medium">Admin</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </header>

        {/* ERROR STATE */}
        {error && (
          <div className="w-full bg-red-900 text-red-200 rounded-lg p-4 mb-6 text-center">{error}</div>
        )}

        {/* METRICS ROW */}
        <section className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${pulse ? 'animate-pulse' : ''}`}>
          {metrics ? (
            <>
              <MetricCard title="Total Mentions Today" value={metrics.totalMentions} />
              <MetricCard title="Sentiment Score" value={((sentiment.positive / (sentiment.positive + sentiment.neutral + sentiment.negative)) * 100).toFixed(0) + '%'} />
              <MetricCard title="Reach/Impressions" value="-" />
              <MetricCard title="Crisis Alert Level" value={crisisAlerts.length ? crisisAlerts[0].level : 'Green'} color={crisisAlerts.length ? '' : 'text-green-400'} />
            </>
          ) : (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-[#10182b] rounded-xl animate-pulse" />)
          )}
        </section>

        {/* MAIN DASHBOARD GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <LineChart data={mentionVolume} loading={loading} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PieChart data={sentiment} loading={loading} />
              <TrendingTopics topics={topics} loading={loading} />
            </div>
          </div>
          {/* Right 1/3 */}
          <div className="flex flex-col gap-6">
            <AlertsPanel
              alerts={crisisAlerts}
              loading={loading}
            />
            <div className="bg-[#10182b] rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-2 text-white">Top Influencers</h3>
              {influencers.length ? (
                influencers.map((influencer) => (
                  <InfluencerCard key={influencer.id} influencer={influencer} loading={loading} />
                ))
              ) : (
                <div className="h-20 bg-[#10182b] rounded-xl animate-pulse" />
              )}
            </div>
            <CompetitorBarChart data={competitorData} loading={loading} />
          </div>
        </section>

        {/* BOTTOM MEDIA TABLE */}
        <section className="mb-8">
          <MediaTable
            data={mediaCoverage.slice((mediaPage - 1) * pageSize, mediaPage * pageSize)}
            loading={loading}
            page={mediaPage}
            pageSize={pageSize}
            total={mediaCoverage.length}
            onPageChange={setMediaPage}
          />
        </section>
        {/* Alert Modal */}
        <AlertModal
          alert={alertModal.alert}
          open={alertModal.open}
          onClose={() => setAlertModal({ open: false, alert: null })}
          onResolve={(id) => {
            // TODO: Implement mark as resolved API call
            setCrisisAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true } : a));
            setAlertModal({ open: false, alert: null });
          }}
        />
        {/* Export Modal */}
        <ExportModal
          open={exportModal}
          onClose={() => setExportModal(false)}
          onExport={async (type, withSummary, email) => {
            setExportLoading(true);
            // TODO: Connect to /api/generate-reports
            setTimeout(() => {
              setExportLoading(false);
              setExportModal(false);
              alert('Exported! (Simulated)');
            }, 2000);
          }}
          loading={exportLoading}
        />
      </main>
    </>
  );
}
