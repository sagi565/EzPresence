import React, { useState } from 'react';
import {
  MetricCardContainer,
  MetricCardGlow,
  MetricHeader,
  MetricLabelWrapper,
  MetricIconBox,
  MetricLabel,
  DeltaBadge,
  MetricValue,
  SparklineWrapper
} from './styles';

interface MetricCardProps {
  label: string;
  value: number;
  delta: number; // % change
  color: string;
  gradient: string;
  icon: React.ReactNode;
  sparkline: number[]; // array of values for mini chart
  formatValue?: (n: number) => string;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// Downsample values to max N points for clean rendering
function downsampleSparkline(values: number[], maxPts = 20): number[] {
  if (values.length <= maxPts) return values;
  const step = values.length / maxPts;
  const result: number[] = [];
  for (let i = 0; i < maxPts; i++) {
    const start = Math.floor(i * step);
    const end = Math.min(Math.floor((i + 1) * step), values.length);
    const chunk = values.slice(start, end);
    result.push(chunk.reduce((s, v) => s + v, 0) / chunk.length);
  }
  return result;
}

const Sparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const pts20 = downsampleSparkline(values, 20);
  if (!pts20.length) return null;
  const w = 80;
  const h = 32;
  const min = Math.min(...pts20);
  const max = Math.max(...pts20);
  const range = max - min || 1;
  const pts = pts20.map((v, i) => {
    const x = (i / (pts20.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  // Smooth cubic bezier path
  const path = pts20.reduce((acc, _v, i) => {
    const [x1, y1] = pts[Math.max(0, i - 1)].split(',').map(Number);
    const [x2, y2] = pts[i].split(',').map(Number);
    if (i === 0) return `M${x2},${y2}`;
    const cpx = (x1 + x2) / 2;
    return `${acc} C${cpx},${y1} ${cpx},${y2} ${x2},${y2}`;
  }, '');

  const areaPath = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${color.replace('#', '')})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  delta,
  color,
  gradient,
  icon,
  sparkline,
  formatValue = formatNum,
}) => {
  const [hovered, setHovered] = useState(false);
  const isPositive = delta >= 0;

  return (
    <MetricCardContainer
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      $hovered={hovered}
      $color={color}
      $gradient={gradient}
    >
      <MetricCardGlow $gradient={gradient} />

      <MetricHeader>
        <MetricLabelWrapper>
          <MetricIconBox $color={color} $hovered={hovered}>
            {icon}
          </MetricIconBox>
          <MetricLabel>{label}</MetricLabel>
        </MetricLabelWrapper>

        <DeltaBadge $isPositive={isPositive} $isZero={delta === 0}>
          {delta !== 0 && <span>{isPositive ? '↑' : '↓'}</span>}
          <span>{Math.abs(delta)}%</span>
        </DeltaBadge>
      </MetricHeader>

      <MetricValue>{formatValue(value)}</MetricValue>

      <SparklineWrapper>
        <Sparkline values={sparkline} color={color} />
      </SparklineWrapper>
    </MetricCardContainer>
  );
};

export default MetricCard;

