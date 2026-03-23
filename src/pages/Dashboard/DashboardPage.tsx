import React, { useState, useEffect } from 'react';
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
import { useTheme } from 'styled-components';
import { Theme } from '@theme/theme';
import {
  PageContainer,
  DashboardContent,
  HeaderSection,
  PageTitle,
  TitleGradient,
  FilterSection,
  TimeRangeWrapper,
  TimeRangeButton,
  KPISection,
  ChartSection,
  SectionHeader,
  SectionTitle,
  ViewAllButton,
  ChartSkeletonContainer,
  SkeletonRow,
  ShimmerPill,
  ChartAreaSkeleton,
  YAxisSkeleton,
  YTickSkeleton,
  GridSkeleton,
  GridLineSkeleton,
  ChartOverlaySkeleton,
  XAxisSkeleton,
  XTickSkeleton,
  MetricSkeletonContainer,
  SkeletonTopStrip,
  SkeletonHeader,
  SkeletonIconBrand,
  SkeletonIcon,
  SkeletonText,
  SkeletonBadge,
  PlatformTabsSkeletonContainer,
  PlatformTabSkeletonCard,
  PlatformTabSkeletonShimmer
} from './styles';

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

// Moved inside component for dynamic theming

const DashboardPage: React.FC = () => {
  const theme = useTheme() as Theme;
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
  const { posts, total: postsTotal, loading: postsLoading } = useDashboardPosts(ready ? safePlatforms : [], 3);

  // A unified "still loading initial data" flag
  const initializing = platformsLoading || !ready || statsLoading;

  return (
    <PageContainer>
      <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />

      <DashboardContent>

        {/* ── Header ── */}
        <HeaderSection>
          <PageTitle>
            <TitleGradient>Overview</TitleGradient>
          </PageTitle>
          <ExportButton onExport={() => setExportOpen(true)} />
        </HeaderSection>

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
        <FilterSection>
          <TimeRangeWrapper>
            {TIME_RANGES.map(r => (
              <TimeRangeButton
                key={r.id}
                onClick={() => setTimeRange(r.id)}
                onMouseEnter={() => setHoveredRange(r.id)}
                onMouseLeave={() => setHoveredRange(null)}
                $active={timeRange === r.id}
                $hovered={hoveredRange === r.id}
              >
                {r.label}
              </TimeRangeButton>
            ))}
          </TimeRangeWrapper>
        </FilterSection>

        {/* ── KPI Cards ── */}
        <KPISection>
          {initializing || !stats ? (
            [1, 2, 3, 4].map((_, i) => <MetricCardSkeleton key={i} />)
          ) : (
            [
              { key: 'views' as const, label: 'Total Views', icon: '👁', color: theme.colors.primary, gradient: theme.gradients.momentum },
              { key: 'likes' as const, label: 'Likes', icon: '❤️', color: theme.colors.pink, gradient: theme.gradients.vibe },
              { key: 'comments' as const, label: 'Comments', icon: '💬', color: theme.colors.secondary, gradient: theme.gradients.innovator },
              { key: 'shares' as const, label: 'Shares', icon: '↗️', color: theme.colors.teal, gradient: theme.gradients.balance },
            ].map(m => {
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
        </KPISection>

        {/* ── Timeline Chart ── */}
        <ChartSection>
          <SectionTitle>Performance Over Time</SectionTitle>
          {initializing || !stats ? (
            <ChartSkeleton />
          ) : (
            <TimelineChart data={stats.timeSeries} timeRange={timeRange} />
          )}
        </ChartSection>

        {/* ── Posts Section ── */}
        <ChartSection>
          <SectionHeader>
            <SectionTitle>Recent Uploads</SectionTitle>
            {!initializing && postsTotal > 3 && (
              <ViewAllButton>View All</ViewAllButton>
            )}
          </SectionHeader>
          <PostsTable posts={posts} loading={initializing || postsLoading} />
        </ChartSection>

      </DashboardContent>

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
    </PageContainer>
  );
};

const ChartSkeleton: React.FC = () => (
  <ChartSkeletonContainer>
    <SkeletonRow>
      {[80, 65, 70, 60].map((w, i) => (
        <ShimmerPill key={i} $width={w} $height={28} />
      ))}
    </SkeletonRow>
    <ChartAreaSkeleton>
      <YAxisSkeleton>
        {[1,2,3,4,5].map(i => (
          <YTickSkeleton key={i} />
        ))}
      </YAxisSkeleton>
      <GridSkeleton>
        {[1,2,3,4,5].map(i => (
          <GridLineSkeleton key={i} />
        ))}
      </GridSkeleton>
      <ChartOverlaySkeleton />
      <XAxisSkeleton>
        {[1,2,3,4,5,6,7].map(i => (
          <XTickSkeleton key={i} />
        ))}
      </XAxisSkeleton>
    </ChartAreaSkeleton>
  </ChartSkeletonContainer>
);

const MetricCardSkeleton: React.FC = () => (
  <MetricSkeletonContainer>
    <SkeletonTopStrip />
    <SkeletonHeader>
      <SkeletonIconBrand>
        <SkeletonIcon />
        <SkeletonText $width={80} $height={13} />
      </SkeletonIconBrand>
      <SkeletonBadge />
    </SkeletonHeader>
    <SkeletonText $width={120} $height={34} />
    <SkeletonText $width={80} $height={32} />
  </MetricSkeletonContainer>
);

const PlatformTabsSkeleton: React.FC = () => (
  <PlatformTabsSkeletonContainer>
    {[180, 155, 165, 155].map((w, i) => (
      <PlatformTabSkeletonCard key={i} $width={w}>
        <PlatformTabSkeletonShimmer />
        <SkeletonText $width={16} $height={16} style={{ borderRadius: 4 }} />
        <SkeletonText $width={20} $height={20} style={{ borderRadius: 4 }} />
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <SkeletonText $width="65%" $height={13} style={{ marginBottom: 5 }} />
          <SkeletonText $width="45%" $height={10} />
        </div>
      </PlatformTabSkeletonCard>
    ))}
  </PlatformTabsSkeletonContainer>
);

export default DashboardPage;

