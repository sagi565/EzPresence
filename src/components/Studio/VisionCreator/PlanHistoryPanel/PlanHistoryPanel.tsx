import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { VisionPlan } from '@hooks/useVisionPlan';
import useVisionHistory, { PlanHistorySummary, PlanStatus } from '@hooks/useVisionHistory';
import ContentDetailModal from '@components/Content/ContentDetailModal/ContentDetailModal';
import { ContentItem } from '@models/ContentList';
export type { PlanStatus };
import {
  SidebarWrapper, SidebarHeader, SidebarIcon, SidebarTitle, ToggleBtn,
  CollapsedToggle, PlansLabel,
  SidebarBody, GroupLabel, PlanRow, PlanInfo,
  PlanTitle, PlanMeta, PlanDate, RowSpinner,
  EmptyMsg, ErrorMsg, SkeletonRow, SkeletonBlock,
  ThumbWrap, ThumbImage, ThumbPlaceholder,
  StatusFallbackIcon, NewPlanRow, NewPlanIcon,
  ProcessingDots, ProcessingDot,
  TooltipBubble,
  ResizeHandle,
  SIDEBAR_W_MIN, SIDEBAR_W_MAX,
} from './styles';

const TOOLTIP_DELAY = 0;

interface TooltipProps {
  label: string;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ label, children }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);

  const show = () => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setPos({ top: r.top - 6, left: r.left + r.width / 2 });
    if (timerRef.current) clearTimeout(timerRef.current);
    if (TOOLTIP_DELAY > 0) {
      timerRef.current = setTimeout(() => setVisible(true), TOOLTIP_DELAY);
    } else {
      setVisible(true);
    }
  };
  const hide = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setVisible(false);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const child = React.cloneElement(children, {
    ref: (node: HTMLElement) => { anchorRef.current = node; },
    onMouseEnter: (e: React.MouseEvent) => { children.props.onMouseEnter?.(e); show(); },
    onMouseLeave: (e: React.MouseEvent) => { children.props.onMouseLeave?.(e); hide(); },
    onFocus:      (e: React.FocusEvent) => { children.props.onFocus?.(e); show(); },
    onBlur:       (e: React.FocusEvent) => { children.props.onBlur?.(e); hide(); },
  });

  return (
    <>
      {child}
      {visible && pos && ReactDOM.createPortal(
        <TooltipBubble style={{ top: pos.top, left: pos.left }}>{label}</TooltipBubble>,
        document.body
      )}
    </>
  );
};

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

const DraftIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);
const ProcessIcon: React.FC = () => (
  <ProcessingDots aria-hidden="true">
    <ProcessingDot $i={0} />
    <ProcessingDot $i={1} />
    <ProcessingDot $i={2} />
  </ProcessingDots>
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
  clipTitle?: string;
  createdAt?: string;
  onOpenContent: (item: ContentItem) => void;
}

const PlanThumb: React.FC<PlanThumbProps> = ({
  status, mediaContentUuid, thumbnailObject, clipTitle, createdAt, onOpenContent,
}) => {
  if (!mediaContentUuid) {
    return (
      <Tooltip label={STATUS_LABELS[status]}>
        <StatusFallbackIcon $status={status}>
          {status === 'in_process' ? <ProcessIcon />
           : status === 'draft'    ? <DraftIcon />
           :                          <VideoIcon />}
        </StatusFallbackIcon>
      </Tooltip>
    );
  }

  const thumbSrc = processThumbnail(thumbnailObject);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenContent({
      id: mediaContentUuid,
      type: 'video',
      title: clipTitle || 'Untitled',
      thumbnail: thumbnailObject || '',
      createdAt,
      mediaType: 'video',
    });
  };

  return (
    <Tooltip label={STATUS_LABELS[status]}>
      <ThumbWrap onClick={handleClick}>
        {thumbSrc ? (
          <ThumbImage src={thumbSrc} alt="" />
        ) : (
          <ThumbPlaceholder><VideoIcon /></ThumbPlaceholder>
        )}
      </ThumbWrap>
    </Tooltip>
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
  width?: number;
  onResize?: (w: number) => void;
  onResizingChange?: (resizing: boolean) => void;
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
  width, onResize, onResizingChange,
}) => {
  const { groupedPlans, plans, loading, error, fetchHistory, fetchPlanDetail } = useVisionHistory();
  const [loadingUuid, setLoadingUuid] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<ContentItem | null>(null);
  const [resizing, setResizing] = useState(false);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onResize) return;
    setResizing(true);
    onResizingChange?.(true);
    const onMove = (ev: MouseEvent) => {
      const next = Math.min(SIDEBAR_W_MAX, Math.max(SIDEBAR_W_MIN, ev.clientX));
      onResize(next);
    };
    const onUp = () => {
      setResizing(false);
      onResizingChange?.(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handlePlanClick = async (summary: PlanHistorySummary) => {
    if (loadingUuid) return;
    if (summary.planUuid === activePlanUuid) return;
    setLoadingUuid(summary.planUuid);
    const plan = await fetchPlanDetail(summary.planUuid);
    setLoadingUuid(null);
    if (plan) onPlanSelect(plan, summary.status ?? 'done');
  };

  /* ── Collapsed ── */
  if (collapsed) {
    return (
      <SidebarWrapper $collapsed $noTransition={resizing}>
        <CollapsedToggle onClick={onToggle} title="Open plans">
          <ChevronRight />
          <PlansLabel>Plans</PlansLabel>
        </CollapsedToggle>
      </SidebarWrapper>
    );
  }

  /* ── Expanded ── */
  return (
    <SidebarWrapper $collapsed={false} $width={width} $noTransition={resizing}>
      <SidebarHeader>
        <SidebarIcon>📋</SidebarIcon>
        <SidebarTitle>Your Plans</SidebarTitle>
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

        {!loading && (
          <NewPlanRow onClick={onPlanDeselect} title="Create New Plan">
            <NewPlanIcon>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </NewPlanIcon>
            <PlanInfo style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
              <PlanTitle>Create New Plan</PlanTitle>
            </PlanInfo>
          </NewPlanRow>
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
                    clipTitle={p.clipTitle}
                    createdAt={p.createdAt}
                    onOpenContent={setModalItem}
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

      <ContentDetailModal
        isOpen={!!modalItem}
        item={modalItem}
        onClose={() => setModalItem(null)}
        onRename={() => {}}
        onDelete={() => setModalItem(null)}
        onToggleFavorite={() => {}}
      />

      {onResize && <ResizeHandle $active={resizing} onMouseDown={handleResizeStart} />}
    </SidebarWrapper>
  );
};

export default PlanHistoryPanel;
