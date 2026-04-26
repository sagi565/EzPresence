import React, { useState, useEffect } from 'react';
import { VisionPlan } from '@hooks/useVisionPlan';
import useVisionHistory, { PlanHistorySummary, PlanStatus } from '@hooks/useVisionHistory';
import { useContentUrl } from '@hooks/contents/useContentUrl';
export type { PlanStatus };
import {
  SidebarWrapper, SidebarHeader, SidebarIcon, SidebarTitle, CountBadge, ToggleBtn,
  CollapsedToggle, PlansLabel,
  SidebarBody, GroupLabel, PlanRow, PlanInfo,
  PlanTitle, PlanMeta, PlanDate, RowSpinner,
  EmptyMsg, ErrorMsg, SkeletonRow, SkeletonBlock,
  ThumbWrap, ThumbImage, ThumbVideo, ThumbPlaceholder,
  PlayOverlay, PlayOverlayMini,
  StatusFallbackIcon, StatusSpinner,
} from './styles';

const STATUS_LABELS: Record<PlanStatus, string> = {
  draft:      'Draft',
  done:       'Done',
  in_process: 'Processing',
};

function processThumbnail(thumb: string | null | undefined): string | null {
  if (!thumb) return null;
  if (thumb.startsWith('http') || thumb.startsWith('data:')) return thumb;
  return `data:image/jpeg;base64,${thumb}`;
}

const PlayIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const StopIcon: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="1.5" />
  </svg>
);
const DraftIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);
const VideoIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

interface PlanThumbProps {
  status: PlanStatus;
  mediaContentUuid?: string | null;
  thumbnailObject?: string | null;
}

const PlanThumb: React.FC<PlanThumbProps> = ({ status, mediaContentUuid, thumbnailObject }) => {
  const [playing, setPlaying] = useState(false);
  const { url, loading, fetchUrl } = useContentUrl();

  if (!mediaContentUuid) {
    return (
      <StatusFallbackIcon $status={status} title={STATUS_LABELS[status]}>
        {status === 'in_process' ? <StatusSpinner />
         : status === 'draft'    ? <DraftIcon />
         :                          <VideoIcon />}
      </StatusFallbackIcon>
    );
  }

  const thumbSrc = processThumbnail(thumbnailObject);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) {
      setPlaying(false);
      return;
    }
    if (!url && !loading) fetchUrl(mediaContentUuid);
    setPlaying(true);
  };

  return (
    <ThumbWrap>
      {playing && url ? (
        <ThumbVideo src={url} autoPlay muted loop playsInline />
      ) : thumbSrc ? (
        <ThumbImage src={thumbSrc} alt="" />
      ) : (
        <ThumbPlaceholder><VideoIcon /></ThumbPlaceholder>
      )}
      <PlayOverlay $playing={playing} onClick={handleToggle} title={playing ? 'Stop preview' : 'Play preview'}>
        <PlayOverlayMini>{playing ? <StopIcon /> : <PlayIcon />}</PlayOverlayMini>
      </PlayOverlay>
    </ThumbWrap>
  );
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now   = new Date();
  const diffMs  = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH   = Math.floor(diffMs / 3_600_000);
  const diffD   = Math.floor(diffMs / 86_400_000);
  if (diffMin < 2)   return 'just now';
  if (diffMin < 60)  return `${diffMin}m ago`;
  if (diffH   < 24)  return `${diffH}h ago`;
  if (diffD   === 1) return 'yesterday';
  if (diffD   < 7)   return `${diffD}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface PlanHistoryPanelProps {
  collapsed: boolean;
  onToggle: () => void;
  onPlanSelect: (plan: VisionPlan, status: PlanStatus) => void;
  onPlanDeselect: () => void;
  activePlanUuid?: string;
}

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const PlanHistoryPanel: React.FC<PlanHistoryPanelProps> = ({
  collapsed, onToggle, onPlanSelect, onPlanDeselect, activePlanUuid,
}) => {
  const { groupedPlans, plans, loading, error, fetchHistory, fetchPlanDetail } = useVisionHistory();
  const [loadingUuid, setLoadingUuid] = useState<string | null>(null);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handlePlanClick = async (summary: PlanHistorySummary) => {
    if (loadingUuid) return;
    if (summary.planUuid === activePlanUuid) { onPlanDeselect(); return; }
    setLoadingUuid(summary.planUuid);
    const plan = await fetchPlanDetail(summary.planUuid);
    setLoadingUuid(null);
    if (plan) onPlanSelect(plan, summary.status ?? 'done');
  };

  /* ── Collapsed ── */
  if (collapsed) {
    return (
      <SidebarWrapper $collapsed>
        <CollapsedToggle onClick={onToggle} title="Open plans">
          <ChevronRight />
          <PlansLabel>Plans</PlansLabel>
        </CollapsedToggle>
      </SidebarWrapper>
    );
  }

  /* ── Expanded ── */
  return (
    <SidebarWrapper $collapsed={false}>
      <SidebarHeader>
        <SidebarIcon>📋</SidebarIcon>
        <SidebarTitle>Plans</SidebarTitle>
        {!loading && plans.length > 0 && <CountBadge>{plans.length}</CountBadge>}
        <ToggleBtn onClick={onToggle} title="Collapse">
          <ChevronLeft />
        </ToggleBtn>
      </SidebarHeader>

      <SidebarBody>
        {loading && (
          <>
            {[150, 110, 180, 130].map((w, i) => (
              <SkeletonRow key={i}>
                <SkeletonBlock $w={28} $h={28} style={{ borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <SkeletonBlock $w={w} $h={11} style={{ marginBottom: 6 }} />
                  <SkeletonBlock $w={60} $h={9} />
                </div>
              </SkeletonRow>
            ))}
          </>
        )}

        {!loading && error && <ErrorMsg>⚠ {error}</ErrorMsg>}

        {!loading && !error && plans.length === 0 && (
          <EmptyMsg>No plans yet.<br />Create your first vision →</EmptyMsg>
        )}

        {!loading && groupedPlans.map(group => (
          <React.Fragment key={group.label}>
            <GroupLabel>{group.label}</GroupLabel>
            {group.plans.map(p => {
              const status = p.status ?? 'done';
              const isRowLoading = loadingUuid === p.planUuid;
              const isActive = activePlanUuid === p.planUuid;
              return (
                <PlanRow
                  key={p.planUuid}
                  $loading={isRowLoading}
                  $active={isActive}
                  onClick={() => handlePlanClick(p)}
                  disabled={!!loadingUuid}
                >
                  <PlanThumb
                    status={status}
                    mediaContentUuid={p.mediaContentUuid}
                    thumbnailObject={p.thumbnailObject}
                  />
                  <PlanInfo>
                    <PlanTitle>{p.clipTitle || 'Untitled Plan'}</PlanTitle>
                    <PlanMeta>
                      <PlanDate>{formatDate(p.createdAt)}</PlanDate>
                    </PlanMeta>
                  </PlanInfo>
                  {isRowLoading && <RowSpinner />}
                </PlanRow>
              );
            })}
          </React.Fragment>
        ))}
      </SidebarBody>
    </SidebarWrapper>
  );
};

export default PlanHistoryPanel;
