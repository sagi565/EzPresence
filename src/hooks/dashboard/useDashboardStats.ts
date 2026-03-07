import { useState, useEffect, useCallback } from 'react';

export type TimeRange = '1d' | '5d' | '30d' | '6m' | 'ytd' | '1y' | '5y' | 'max';
export type Platform = 'all' | 'instagram' | 'facebook' | 'tiktok' | 'youtube';

export interface DayStats {
  date: string;
  views: number;
  likes: number;
  shares: number;
  posts: number;
  comments: number;
}

export interface DashboardStats {
  timeSeries: DayStats[];
  totals: {
    views: number;
    likes: number;
    shares: number;
    posts: number;
    comments: number;
  };
  deltas: {
    views: number;
    likes: number;
    shares: number;
    posts: number;
    comments: number;
  };
}

const platformMultipliers: Record<string, number> = {
  all: 1,
  instagram: 0.42,
  facebook: 0.28,
  tiktok: 0.19,
  youtube: 0.11,
};

function ytdDays(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  return Math.max(1, Math.ceil((now.getTime() - startOfYear.getTime()) / 86400000));
}

export const daysForRange: Record<TimeRange, number> = {
  '1d': 1,
  '5d': 5,
  '30d': 30,
  '6m': 180,
  'ytd': ytdDays(),
  '1y': 365,
  '5y': 365 * 5,
  'max': 365 * 7,
};

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateMockTimeSeries(days: number, platform: string): DayStats[] {
  const multiplier = platformMultipliers[platform] ?? 0.3;
  const series: DayStats[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const seed = date.getTime() / 86400000 + platform.length;
    const trend = 1 + (days - i) / days * 0.3;
    const noise = 0.7 + seededRandom(seed) * 0.6;
    const baseViews = Math.round(1200 * multiplier * trend * noise);
    series.push({
      date: dateStr,
      views: baseViews,
      likes: Math.round(baseViews * 0.08 * seededRandom(seed + 1)),
      shares: Math.round(baseViews * 0.03 * seededRandom(seed + 2)),
      posts: Math.round(seededRandom(seed + 3) < 0.6 ? 1 : seededRandom(seed + 4) < 0.3 ? 2 : 0),
      comments: Math.round(baseViews * 0.02 * seededRandom(seed + 5)),
    });
  }
  return series;
}

// Aggregate multiple platform series by date
function aggregateSeries(seriesArr: DayStats[][]): DayStats[] {
  if (!seriesArr.length) return [];
  const base = seriesArr[0];
  return base.map((day, i) => ({
    date: day.date,
    views: seriesArr.reduce((s, arr) => s + (arr[i]?.views ?? 0), 0),
    likes: seriesArr.reduce((s, arr) => s + (arr[i]?.likes ?? 0), 0),
    shares: seriesArr.reduce((s, arr) => s + (arr[i]?.shares ?? 0), 0),
    posts: seriesArr.reduce((s, arr) => s + (arr[i]?.posts ?? 0), 0),
    comments: seriesArr.reduce((s, arr) => s + (arr[i]?.comments ?? 0), 0),
  }));
}

function computeTotals(series: DayStats[]) {
  return series.reduce(
    (acc, d) => ({
      views: acc.views + d.views,
      likes: acc.likes + d.likes,
      shares: acc.shares + d.shares,
      posts: acc.posts + d.posts,
      comments: acc.comments + d.comments,
    }),
    { views: 0, likes: 0, shares: 0, posts: 0, comments: 0 },
  );
}

function pct(c: number, p: number) {
  return p === 0 ? 100 : Math.round(((c - p) / p) * 100);
}

function computeDeltas(current: DayStats[], prev: DayStats[]) {
  const cur = computeTotals(current);
  const pre = computeTotals(prev);
  return {
    views: pct(cur.views, pre.views),
    likes: pct(cur.likes, pre.likes),
    shares: pct(cur.shares, pre.shares),
    posts: pct(cur.posts, pre.posts),
    comments: pct(cur.comments, pre.comments),
  };
}

// For large ranges, downsample to N points so chart looks clean
export function downsample(series: DayStats[], maxPoints: number): DayStats[] {
  if (series.length <= maxPoints) return series;
  const step = series.length / maxPoints;
  const result: DayStats[] = [];
  for (let i = 0; i < maxPoints; i++) {
    const startIdx = Math.floor(i * step);
    const endIdx = Math.min(Math.floor((i + 1) * step), series.length);
    const chunk = series.slice(startIdx, endIdx);
    result.push({
      date: chunk[0].date,
      views: Math.round(chunk.reduce((s, d) => s + d.views, 0) / chunk.length),
      likes: Math.round(chunk.reduce((s, d) => s + d.likes, 0) / chunk.length),
      shares: Math.round(chunk.reduce((s, d) => s + d.shares, 0) / chunk.length),
      posts: Math.round(chunk.reduce((s, d) => s + d.posts, 0) / chunk.length),
      comments: Math.round(chunk.reduce((s, d) => s + d.comments, 0) / chunk.length),
    });
  }
  return result;
}

// Max chart data points per range
const MAX_POINTS: Record<TimeRange, number> = {
  '1d': 24,   // hourly
  '5d': 5,
  '30d': 30,
  '6m': 26,   // ~weekly
  'ytd': 52,
  '1y': 52,
  '5y': 60,
  'max': 84,
};

export const useDashboardStats = (timeRange: TimeRange, platforms: string[]) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const days = daysForRange[timeRange];
      const effectivePlatforms = platforms.length ? platforms : ['all'];

      // Generate per-platform series and aggregate
      const allSeries = effectivePlatforms.map(p => generateMockTimeSeries(days, p));
      const aggregated = aggregateSeries(allSeries);

      // Downsample for clean chart rendering
      const downsampled = downsample(aggregated, MAX_POINTS[timeRange]);

      // Prev period for deltas
      const prevSeries = aggregated.map((d, i) => {
        const seed = i * 0.9 + effectivePlatforms.join('').length;
        const noise = 0.65 + seededRandom(seed) * 0.5;
        return {
          ...d,
          views: Math.round(d.views * noise),
          likes: Math.round(d.likes * noise),
          shares: Math.round(d.shares * noise),
          posts: d.posts,
          comments: Math.round(d.comments * noise),
        };
      });

      setStats({
        timeSeries: downsampled,
        totals: computeTotals(aggregated),
        deltas: computeDeltas(aggregated, prevSeries),
      });
      setLoading(false);
    }, 300);
  }, [timeRange, platforms.join(',')]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
};
