import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { theme } from '@theme/theme';
import type { DayStats } from '@/hooks/dashboard/useDashboardStats';

export type MetricKey = 'views' | 'likes' | 'shares' | 'posts';

interface SeriesConfig {
  key: MetricKey;
  label: string;
  color: string;
}

const SERIES: SeriesConfig[] = [
  { key: 'views', label: 'Views', color: theme.colors.primary },
  { key: 'likes', label: 'Likes', color: theme.colors.pink },
  { key: 'shares', label: 'Shares', color: theme.colors.teal },
  { key: 'posts', label: 'Posts', color: theme.colors.secondary },
];

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatXDate(dateStr: string, timeRange: string): string {
  const d = new Date(dateStr);
  if (timeRange === '1d') return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  if (timeRange === '5d') return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  if (timeRange === '30d') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (timeRange === '6m' || timeRange === 'ytd' || timeRange === '1y') return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  // 5y, max
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

interface TimelineChartProps {
  data: DayStats[];
  timeRange: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.93)',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      minWidth: 140,
    }}>
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 6px' }}>{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'white', fontWeight: 600 }}>
            {entry.name}: {formatNum(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const TimelineChart: React.FC<TimelineChartProps> = ({ data, timeRange }) => {
  const [activeSeries, setActiveSeries] = useState<Set<MetricKey>>(
    new Set(['views', 'likes', 'shares']),
  );

  const toggleSeries = (key: MetricKey) => {
    setActiveSeries(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Max ~8 visible ticks regardless of data length
  const MAX_TICKS = 8;
  const tickInterval = Math.max(1, Math.ceil(data.length / MAX_TICKS));

  const chartData = data.map(d => ({
    ...d,
    displayDate: formatXDate(d.date, timeRange),
  }));

  return (
    <div style={{
      background: 'white',
      borderRadius: theme.borderRadius.lg,
      padding: '24px',
      boxShadow: theme.shadows.md,
    }}>
      {/* Series toggle legend */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {SERIES.map(s => {
          const active = activeSeries.has(s.key);
          return (
            <button
              key={s.key}
              onClick={() => toggleSeries(s.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 13px', borderRadius: '20px',
                border: `1.5px solid ${active ? s.color : '#e5e7eb'}`,
                background: active ? `${s.color}15` : 'transparent',
                color: active ? s.color : theme.colors.muted,
                fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', transition: 'all 0.18s',
              }}
            >
              <span style={{
                width: 9, height: 9, borderRadius: '50%',
                background: active ? s.color : '#d1d5db',
                display: 'inline-block',
              }} />
              {s.label}
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 11, fill: theme.colors.muted }}
            axisLine={false}
            tickLine={false}
            interval={tickInterval - 1}
          />
          <YAxis
            tickFormatter={formatNum}
            tick={{ fontSize: 11, fill: theme.colors.muted }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1 }} />

          {SERIES.filter(s => activeSeries.has(s.key)).map(s => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: s.color,
                stroke: 'white',
                strokeWidth: 2,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
