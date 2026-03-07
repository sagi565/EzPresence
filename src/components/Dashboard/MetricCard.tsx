import React, { useState } from 'react';
import { theme } from '@theme/theme';

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
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: theme.borderRadius.lg,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: hovered
          ? `0 8px 32px rgba(0,0,0,0.12), 0 0 0 2px ${color}25`
          : theme.shadows.md,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'default',
        flex: '1 1 0',
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient top glow strip */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: gradient,
        borderRadius: '16px 16px 0 0',
      }} />

      {/* Icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: '10px',
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            transition: 'transform 0.2s',
            transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)',
          }}>
            {icon}
          </div>
          <span style={{
            fontSize: '13px', fontWeight: 600,
            color: theme.colors.muted, letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {label}
          </span>
        </div>

        {/* Delta badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '3px',
          background: delta === 0
            ? 'rgba(107, 114, 128, 0.1)'
            : isPositive ? 'rgba(20, 184, 166, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: delta === 0
            ? theme.colors.muted
            : isPositive ? '#14b8a6' : '#ef4444',
          borderRadius: '20px', padding: '3px 8px',
          fontSize: '12px', fontWeight: 700,
        }}>
          {delta !== 0 && <span>{isPositive ? '↑' : '↓'}</span>}
          <span>{Math.abs(delta)}%</span>
        </div>
      </div>

      {/* Big number */}
      <div style={{
        fontSize: '34px', fontWeight: 800,
        color: theme.colors.text, letterSpacing: '-1.5px', lineHeight: 1,
      }}>
        {formatValue(value)}
      </div>

      {/* Sparkline */}
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <Sparkline values={sparkline} color={color} />
      </div>
    </div>
  );
};

export default MetricCard;
