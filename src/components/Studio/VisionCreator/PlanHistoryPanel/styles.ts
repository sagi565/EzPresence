import styled, { keyframes } from 'styled-components';
import { PlanStatus } from '@hooks/useVisionHistory';

const shimmer = keyframes`0%{background-position:-200px 0}100%{background-position:200px 0}`;
const spin    = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const fadeIn  = keyframes`from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}`;

export const SIDEBAR_W_OPEN     = 264;
export const SIDEBAR_W_COLLAPSED = 52;

/* Fixed full-height sidebar — sits from top:0 to bottom:0 */
export const SidebarWrapper = styled.div<{ $collapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${p => p.$collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_OPEN}px;
  z-index: 15;
  display: flex;
  flex-direction: column;
  background: ${p => p.theme.colors.surface};
  border-right: 1px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)'};
  box-shadow: 2px 0 12px ${p => p.theme.mode === 'dark' ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.06)'};
  transition: width .22s cubic-bezier(.4,0,.2,1);
  overflow: hidden;

  @media (max-width: 768px) {
    width: ${p => p.$collapsed ? SIDEBAR_W_COLLAPSED : 100}${p => p.$collapsed ? 'px' : 'vw'};
    z-index: ${p => p.$collapsed ? 15 : 200};
    box-shadow: ${p => p.$collapsed
      ? '2px 0 8px rgba(0,0,0,.08)'
      : '4px 0 40px rgba(0,0,0,.25)'};
  }
`;

/* ── Collapsed state ─────────────────────────────────────────────────────── */

export const CollapsedToggle = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding-top: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${p => p.theme.colors.muted};
  font-family: inherit;
  transition: color .15s, background .15s;
  &:hover {
    background: ${p => p.theme.mode === 'dark' ? 'rgba(139,92,246,.06)' : 'rgba(139,92,246,.04)'};
    color: ${p => p.theme.colors.primary};
  }
  &:hover span { opacity: .7; }
`;

export const PlansLabel = styled.span`
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.muted};
  opacity: .4;
  user-select: none;
  transition: opacity .15s;
`;

/* ── Expanded header ─────────────────────────────────────────────────────── */

export const SidebarHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 14px;
  height: 52px;
  border-bottom: 1px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'};
`;

export const SidebarIcon = styled.div`
  font-size: 15px;
  line-height: 1;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
`;

export const SidebarTitle = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.muted};
  opacity: .55;
  white-space: nowrap;
  flex: 1;
`;

export const CountBadge = styled.div`
  padding: 2px 7px;
  border-radius: 999px;
  background: ${p => p.theme.colors.primaryLight};
  border: 1px solid rgba(139,92,246,.18);
  font-size: 10px;
  font-weight: 800;
  color: ${p => p.theme.colors.primary};
  white-space: nowrap;
`;

export const ToggleBtn = styled.button`
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'};
  border-radius: 7px;
  cursor: pointer;
  color: ${p => p.theme.colors.muted};
  transition: background .15s, color .15s;
  &:hover {
    background: ${p => p.theme.mode === 'dark' ? 'rgba(139,92,246,.15)' : 'rgba(139,92,246,.1)'};
    color: ${p => p.theme.colors.primary};
  }
`;

/* ── Plan list ───────────────────────────────────────────────────────────── */

export const SidebarBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(139,92,246,.15) transparent;
  padding: 6px 0 24px;
`;

export const GroupLabel = styled.div`
  padding: 10px 14px 4px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.muted};
  opacity: .4;
  white-space: nowrap;
`;

export const PlanRow = styled.button<{ $loading?: boolean; $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 8px 14px;
  border: none;
  cursor: ${p => p.$loading ? 'default' : 'pointer'};
  font-family: inherit;
  text-align: left;
  position: relative;
  background: ${p => p.$active
    ? (p.theme.mode === 'dark' ? 'rgba(139,92,246,.12)' : 'rgba(139,92,246,.08)')
    : 'transparent'};
  opacity: ${p => p.$loading ? .6 : 1};
  transition: background .14s;
  &::before {
    content: '';
    position: absolute;
    left: 0; top: 6px; bottom: 6px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: ${p => p.theme.colors.primary};
    opacity: ${p => p.$active ? 1 : 0};
    transition: opacity .15s;
  }
  &:hover:not(:disabled) {
    background: ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)'};
  }
  animation: ${fadeIn} .2s ease both;
`;

const STATUS_ICON_BG: Record<PlanStatus, string> = {
  draft:      'rgba(251,191,36,.1)',
  done:       'rgba(34,197,94,.1)',
  in_process: 'rgba(139,92,246,.1)',
};

export const ThumbWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  background: ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'};
  border: 1px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'};
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.muted};
`;

export const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const ThumbVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #000;
`;

export const ThumbPlaceholder = styled.div`
  font-size: 13px;
  opacity: .6;
  line-height: 1;
`;

export const PlayOverlay = styled.div<{ $playing?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$playing ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.45)'};
  color: #fff;
  opacity: ${p => p.$playing ? 0 : 0};
  transition: opacity .15s;
  cursor: pointer;
  ${PlanRow}:hover & { opacity: 1; }
  &:hover { opacity: 1 !important; background: rgba(0,0,0,.55); }
`;

export const PlayOverlayMini = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,.5));
`;

const STATUS_FALLBACK_COLOR: Record<PlanStatus, string> = {
  draft:      '#d97706',
  done:       '#16a34a',
  in_process: '#9b5de5',
};

export const StatusFallbackIcon = styled.div<{ $status: PlanStatus }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$status === 'in_process'
    ? 'rgba(139,92,246,.1)'
    : p.$status === 'draft'
      ? 'rgba(251,191,36,.12)'
      : 'rgba(34,197,94,.1)'};
  border: 1px solid ${p => p.$status === 'in_process'
    ? 'rgba(139,92,246,.22)'
    : p.$status === 'draft'
      ? 'rgba(251,191,36,.28)'
      : 'rgba(34,197,94,.22)'};
  color: ${p => STATUS_FALLBACK_COLOR[p.$status]};
  margin-top: 1px;
`;

export const StatusSpinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(139,92,246,.25);
  border-top-color: #9b5de5;
  border-radius: 50%;
  animation: ${spin} .7s linear infinite;
`;

export const PlanRowIcon = styled.div<{ $status: PlanStatus }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: ${p => STATUS_ICON_BG[p.$status]};
  margin-top: 1px;
`;

export const PlanInfo = styled.div`flex: 1; min-width: 0;`;

export const PlanTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -.1px;
  color: ${p => p.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.35;
`;

export const PlanMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  flex-wrap: wrap;
`;

export const PlanDate = styled.div`
  font-size: 10px;
  color: ${p => p.theme.colors.muted};
  opacity: .55;
`;

const STATUS_MAP: Record<PlanStatus, { bg: string; border: string; color: string }> = {
  draft:      { bg: 'rgba(251,191,36,.1)',  border: 'rgba(251,191,36,.25)', color: '#d97706' },
  done:       { bg: 'rgba(34,197,94,.09)',  border: 'rgba(34,197,94,.22)',  color: '#16a34a' },
  in_process: { bg: 'rgba(139,92,246,.1)',  border: 'rgba(139,92,246,.22)', color: '#9b5de5' },
};

export const StatusBadge = styled.div<{ $status: PlanStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 6px;
  border-radius: 999px;
  background: ${p => STATUS_MAP[p.$status].bg};
  border: 1px solid ${p => STATUS_MAP[p.$status].border};
  font-size: 9.5px;
  font-weight: 700;
  color: ${p => STATUS_MAP[p.$status].color};
  white-space: nowrap;
`;

export const StatusDot = styled.div<{ $status: PlanStatus }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${p => STATUS_MAP[p.$status].color};
`;

export const RowSpinner = styled.div`
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  margin-top: 7px;
  border: 2px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.1)'};
  border-top-color: ${p => p.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} .6s linear infinite;
`;

export const EmptyMsg = styled.div`
  padding: 24px 14px;
  font-size: 11.5px;
  color: ${p => p.theme.colors.muted};
  opacity: .45;
  text-align: center;
  font-style: italic;
  line-height: 1.6;
`;

export const ErrorMsg = styled.div`
  padding: 12px 14px;
  font-size: 11px;
  color: #ef4444;
  opacity: .75;
`;

export const SkeletonRow = styled.div`
  padding: 9px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SkeletonBlock = styled.div<{ $w: number; $h?: number }>`
  width: ${p => p.$w}px;
  height: ${p => p.$h || 11}px;
  border-radius: 5px;
  flex-shrink: 0;
  background: linear-gradient(90deg,
    ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'} 0%,
    ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.11)' : 'rgba(0,0,0,.1)'} 50%,
    ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'} 100%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;
