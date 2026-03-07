import React, { useState, useEffect } from 'react';
import { theme } from '@theme/theme';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import { useBrands } from '@/hooks/brands/useBrands';
import { useConnectedPlatforms } from '@/hooks/platforms/useConnectedPlatforms';
import { useDashboardStats, type TimeRange } from '@/hooks/dashboard/useDashboardStats';
import { useDashboardPosts } from '@/hooks/dashboard/useDashboardPosts';
import MetricCard from '@components/Dashboard/MetricCard';
import PlatformTabs from '@components/Dashboard/PlatformTabs';
import TimelineChart from '@components/Dashboard/TimelineChart';
import PostsTable from '@components/Dashboard/PostsTable';
import ExportButton from '@components/Dashboard/ExportButton';
import ExportModal from '@components/Dashboard/ExportModal';

const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: '1d',  label: 'Day' },
  { id: '5d',  label: '5D' },
  { id: '30d', label: 'Month' },
  { id: '6m',  label: '6M' },
  { id: 'ytd', label: 'YTD' },
  { id: '1y',  label: 'Year' },
  { id: '5y',  label: '5Y' },
  { id: 'max', label: 'Max' },
];

const METRIC_CONFIGS = [
  { key: 'views' as const, label: 'Total Views', icon: '👁', color: theme.colors.primary, gradient: theme.gradients.momentum },
  { key: 'posts' as const, label: 'Posts', icon: '📝', color: theme.colors.secondary, gradient: theme.gradients.innovator },
  { key: 'likes' as const, label: 'Likes', icon: '❤️', color: theme.colors.pink, gradient: theme.gradients.vibe },
  { key: 'shares' as const, label: 'Shares', icon: '↗️', color: theme.colors.teal, gradient: theme.gradients.balance },
];

const DashboardPage: React.FC = () => {
  const { brands, currentBrand, switchBrand } = useBrands();
  const { platforms: connectedPlatforms, loading: platformsLoading } = useConnectedPlatforms();

  const activePlatforms = connectedPlatforms.filter(p => p.isConnected);

  // null = not yet initialized; [] would trigger hooks immediately with "all"
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[] | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [hoveredRange, setHoveredRange] = useState<TimeRange | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // Auto-select first connected platform exactly once after platforms load
  useEffect(() => {
    if (!platformsLoading && selectedPlatforms === null) {
      // Whether or not any are connected, mark as initialized
      const first = activePlatforms[0]?.platform;
      setSelectedPlatforms(first ? [first] : []);
    }
  }, [platformsLoading]); // intentionally only re-run when loading state changes

  // Only fetch data once platforms have been initialized
  const ready = selectedPlatforms !== null;
  const safePlatforms = selectedPlatforms ?? [];

  const { stats, loading: statsLoading } = useDashboardStats(timeRange, ready ? safePlatforms : []);
  const { posts, total: postsTotal, loading: postsLoading } = useDashboardPosts(ready ? safePlatforms : [], 8);

  // A unified "still loading initial data" flag
  const initializing = platformsLoading || !ready || statsLoading;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme.gradients.background,
    }}>
      <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />

      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 40px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <h1 style={{
            fontSize: '34px', fontWeight: 800,
            letterSpacing: '-1px', margin: 0,
          }}>
            <span style={{
              background: theme.gradients.momentum,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Overview
            </span>
          </h1>
          <ExportButton onExport={() => setExportOpen(true)} />
        </div>

        {/* ── Platform Tabs (multi-select, real data) ── */}
        {!ready || platformsLoading ? (
          <PlatformTabsSkeleton />
        ) : (
          <PlatformTabs
            connectedPlatforms={connectedPlatforms}
            selected={safePlatforms}
            onChange={setSelectedPlatforms}
          />
        )}

        {/* ── Time Range Selector ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex', gap: '3px',
            background: 'white',
            borderRadius: theme.borderRadius.full,
            padding: '4px',
            boxShadow: theme.shadows.sm,
          }}>
            {TIME_RANGES.map(r => {
              const isActive = timeRange === r.id;
              const isHov = hoveredRange === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setTimeRange(r.id)}
                  onMouseEnter={() => setHoveredRange(r.id)}
                  onMouseLeave={() => setHoveredRange(null)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: theme.borderRadius.full,
                    border: 'none',
                    background: isActive
                      ? theme.gradients.momentum
                      : isHov ? '#f3f4f6' : 'transparent',
                    color: isActive ? 'white' : isHov ? theme.colors.text : theme.colors.muted,
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 2px 8px rgba(155,93,229,0.35)' : 'none',
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {initializing || !stats ? (
            METRIC_CONFIGS.map((_m, i) => <MetricCardSkeleton key={i} />)
          ) : (
            METRIC_CONFIGS.map(m => {
              const total = stats.totals[m.key];
              const delta = stats.deltas[m.key];
              const sparkline = stats.timeSeries.map(d => d[m.key]);
              return (
                <MetricCard
                  key={m.key}
                  label={m.label}
                  value={total}
                  delta={delta}
                  color={m.color}
                  gradient={m.gradient}
                  icon={<span style={{ fontSize: '18px' }}>{m.icon}</span>}
                  sparkline={sparkline}
                />
              );
            })
          )}
        </div>

        {/* ── Timeline Chart ── */}
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: theme.colors.text, margin: '0 0 12px' }}>
            Performance Over Time
          </h2>
          {initializing || !stats ? (
            <ChartSkeleton />
          ) : (
            <TimelineChart data={stats.timeSeries} timeRange={timeRange} />
          )}
        </div>

        {/* ── Posts Section ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: theme.colors.text, margin: 0 }}>
              Recent Uploads
            </h2>
            {!initializing && postsTotal > 3 && (
              <button
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: theme.colors.primary, fontWeight: 700, fontSize: '14px', padding: 0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
              >
                View All
              </button>
            )}
          </div>
          <PostsTable posts={posts} loading={initializing || postsLoading} />
        </div>

      </div>

      {/* ── Export Modal ── */}
      {exportOpen && (
        <ExportModal
          stats={stats}
          posts={posts}
          platforms={safePlatforms}
          timeRange={timeRange}
          onClose={() => setExportOpen(false)}
        />
      )}
    </div>
  );
};

const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 8px;
  }
`;

const ShimmerStyle: React.FC = () => (
  <style dangerouslySetInnerHTML={{ __html: shimmerStyle }} />
);

const ChartSkeleton: React.FC = () => (
  <div style={{
    background: 'white', borderRadius: theme.borderRadius.lg,
    padding: '24px', boxShadow: theme.shadows.md,
  }}>
    <ShimmerStyle />
    {/* Legend pills skeleton */}
    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
      {[80, 65, 70, 60].map((w, i) => (
        <div key={i} className="shimmer" style={{ width: w, height: 28, borderRadius: 20 }} />
      ))}
    </div>
    {/* Chart area skeleton */}
    <div style={{ position: 'relative', height: 280 }}>
      {/* Y-axis ticks */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 36 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="shimmer" style={{ width: 28, height: 10 }} />
        ))}
      </div>
      {/* Grid lines + bars */}
      <div style={{ marginLeft: 44, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ height: 1, background: '#f3f4f6', width: '100%' }} />
        ))}
      </div>
      {/* Fake squiggly lines overlay */}
      <div style={{
        position: 'absolute', inset: '0 0 24px 44px',
        background: 'linear-gradient(180deg, rgba(155,93,229,0.07) 0%, transparent 100%)',
        borderRadius: 4,
      }} />
      {/* X-axis ticks */}
      <div style={{ position: 'absolute', bottom: 0, left: 44, right: 0, display: 'flex', justifyContent: 'space-between' }}>
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className="shimmer" style={{ width: 36, height: 10 }} />
        ))}
      </div>
    </div>
  </div>
);

const MetricCardSkeleton: React.FC = () => (
  <div style={{
    background: 'white', borderRadius: theme.borderRadius.lg,
    padding: '20px 24px', flex: '1 1 0', minWidth: 0,
    boxShadow: theme.shadows.md, display: 'flex', flexDirection: 'column', gap: 12,
    position: 'relative', overflow: 'hidden',
  }}>
    <ShimmerStyle />
    {/* Top strip */}
    <div className="shimmer" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '8px 8px 0 0' }} />
    {/* Icon + label row */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="shimmer" style={{ width: 38, height: 38, borderRadius: 10 }} />
        <div className="shimmer" style={{ width: 80, height: 13 }} />
      </div>
      <div className="shimmer" style={{ width: 48, height: 22, borderRadius: 20 }} />
    </div>
    {/* Big number */}
    <div className="shimmer" style={{ width: 120, height: 34 }} />
    {/* Sparkline */}
    <div className="shimmer" style={{ width: 80, height: 32 }} />
  </div>
);

const PlatformTabsSkeleton: React.FC = () => (
  <div style={{ display: 'flex', gap: '10px' }}>
    <ShimmerStyle />
    {[180, 155, 165, 155].map((w, i) => (
      <div key={i} style={{
        width: w, height: 58, borderRadius: theme.borderRadius.md,
        position: 'relative', overflow: 'hidden',
        background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
      }}>
        <div className="shimmer" style={{ position: 'absolute', inset: 0, borderRadius: theme.borderRadius.md }} />
        {/* Checkbox */}
        <div className="shimmer" style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, position: 'relative', zIndex: 1 }} />
        {/* Platform icon circle */}
        <div className="shimmer" style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, position: 'relative', zIndex: 1 }} />
        {/* Text lines */}
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div className="shimmer" style={{ width: '65%', height: 13, marginBottom: 5 }} />
          <div className="shimmer" style={{ width: '45%', height: 10 }} />
        </div>
      </div>
    ))}
  </div>
);

export default DashboardPage;
