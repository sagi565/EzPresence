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
import { useTheme } from 'styled-components';
import { Theme } from '@theme/theme';
import type { DayStats } from '@/hooks/dashboard/useDashboardStats';
import {
  ChartContainer,
  LegendContainer,
  LegendButton,
  LegendDot,
  TooltipContainer,
  TooltipLabel,
  TooltipItem,
  TooltipDot,
  TooltipValue
} from './styles';

export type MetricKey = 'views' | 'likes' | 'shares' | 'comments';

interface SeriesConfig {
  key: MetricKey;
  label: string;
  colorKey: keyof Theme['colors'];
}

const SERIES_CONFIG: SeriesConfig[] = [
  { key: 'views', label: 'Views', colorKey: 'primary' },
  { key: 'likes', label: 'Likes', colorKey: 'pink' },
  { key: 'shares', label: 'Shares', colorKey: 'teal' },
  { key: 'comments', label: 'Comments', colorKey: 'secondary' },
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
    <TooltipContainer>
      <TooltipLabel>{label}</TooltipLabel>
      {payload.map((entry: any) => (
        <TooltipItem key={entry.dataKey}>
          <TooltipDot $color={entry.color} />
          <TooltipValue>
            {entry.name}: {formatNum(entry.value)}
          </TooltipValue>
        </TooltipItem>
      ))}
    </TooltipContainer>
  );
};

const TimelineChart: React.FC<TimelineChartProps> = ({ data, timeRange }) => {
  const theme = useTheme() as Theme;
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
  const MAX_TICKS = 5;
  const tickInterval = Math.max(1, Math.ceil(data.length / MAX_TICKS));

  const chartData = data.map(d => ({
    ...d,
    displayDate: formatXDate(d.date, timeRange),
  }));

  const series = SERIES_CONFIG.map(s => ({
    ...s,
    color: theme.colors[s.colorKey]
  }));

  return (
    <ChartContainer>
      {/* Series toggle legend */}
      <LegendContainer>
        {series.map(s => {
          const active = activeSeries.has(s.key);
          return (
            <LegendButton
              key={s.key}
              onClick={() => toggleSeries(s.key)}
              $active={active}
              $color={s.color}
            >
              <LegendDot $active={active} $color={s.color} />
              {s.label}
            </LegendButton>
          );
        })}
      </LegendContainer>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={`${theme.colors.primary}1A`} vertical={false} />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 11, fill: theme.colors.muted }}
            axisLine={false}
            tickLine={false}
            interval={tickInterval - 1}
            minTickGap={30}
          />
          <YAxis
            tickFormatter={formatNum}
            tick={{ fontSize: 11, fill: theme.colors.muted }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: `${theme.colors.primary}26`, strokeWidth: 1 }} 
          />

          {series.filter(s => activeSeries.has(s.key)).map(s => (
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
                stroke: theme.colors.surface,
                strokeWidth: 2,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TimelineChart;

