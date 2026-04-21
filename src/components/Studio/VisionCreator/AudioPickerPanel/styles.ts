import styled, { keyframes, css } from 'styled-components';

/* ── Animations ────────────────────────────────────────────────── */
const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0);    }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: translateY(0);   }
`;
const slideInFromRight = keyframes`
  from { opacity: 0; transform: translateX(10px); }
  to   { opacity: 1; transform: translateX(0);    }
`;
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* ── Theme tokens ──────────────────────────────────────────────── */
const ACCENT      = '#8b5cf6';
const ACCENT_DARK = '#7c3aed';
const ACCENT_TINT = 'rgba(139,92,246,.16)';
const ACCENT_LINE = 'rgba(139,92,246,.22)';
const BAR_DIM     = 'rgba(150,155,180,.62)';   // darker neutral — bars read clearly
const BAR_OUT     = 'rgba(150,155,180,.52)';   // a touch lighter than BAR_DIM, still solid
const SEL_FILL    = 'rgba(139,92,246,.06)';

/* ── Panel ─────────────────────────────────────────────────────── */
export const Panel = styled.div`
  width: 100%;
  background: ${p => p.theme.colors.surface};
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,.18);
  padding: 12px 13px 10px;
  margin-top: 6px;
  animation: ${fadeDown} .18s ease-out;
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

/* ── URL Row ───────────────────────────────────────────────────── */
export const UrlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const UrlInput = styled.input`
  flex: 1;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 8px;
  outline: none;
  font-size: 12.5px;
  font-family: inherit;
  color: ${p => p.theme.colors.text};
  padding: 7px 11px;
  caret-color: ${ACCENT};
  transition: border-color .14s, background .14s;

  &::placeholder { color: ${p => p.theme.colors.muted}; opacity: .55; }
  &:hover { border-color: rgba(255,255,255,.14); }
  &:focus { border-color: ${ACCENT_LINE}; background: rgba(255,255,255,.05); }
`;

export const ClearBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer;
  padding: 5px; border-radius: 6px; flex-shrink: 0;
  color: ${p => p.theme.colors.muted}; opacity: .55;
  transition: opacity .12s, background .12s, color .12s;
  &:hover { opacity: 1; background: rgba(255,255,255,.05); color: ${p => p.theme.colors.text}; }
`;

/* ── Info Row ──────────────────────────────────────────────────── */
export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 22px;
`;

export const PlatformRow = styled.div`
  display: flex;
  align-items: center;
  /* gap removed — each icon owns its own margin-right so it can collapse to 0 */
  flex-shrink: 0;
`;

export const PlatformIconImg = styled.img<{ $active: boolean; $small?: boolean; $visible?: boolean }>`
  width:  ${p => p.$small ? '14px' : '17px'};
  height: ${p => p.$small ? '14px' : '17px'};
  object-fit: contain;
  flex-shrink: 0;
  /* Inactive icons stay clearly readable — muted, not faded out. */
  opacity: ${p => (p.$visible === false ? 0 : (p.$active ? 1 : .62))};
  filter: ${p => p.$active ? 'none' : 'grayscale(.55)'};
  /* collapse: shrink width, opacity, margin, scale together */
  max-width: ${p => p.$visible === false ? '0px' : (p.$small ? '14px' : '17px')};
  margin-right: ${p => p.$visible === false ? '0px' : '7px'};
  transform: ${p => p.$visible === false ? 'scale(.6)' : 'scale(1)'};
  transform-origin: left center;
  transition:
    max-width   .28s cubic-bezier(.2,.9,.25,1),
    margin-right .28s cubic-bezier(.2,.9,.25,1),
    transform   .28s cubic-bezier(.2,.9,.25,1),
    opacity     .22s ease,
    filter      .22s ease;
`;

export const VideoName = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 11.5px;
  font-weight: 500;
  color: ${p => p.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: .005em;
  animation: ${slideInFromRight} .24s cubic-bezier(.2,.9,.25,1) both;
`;

export const VideoDurationBadge = styled.span`
  font-size: 10.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: ${p => p.theme.colors.muted};
  flex-shrink: 0;
  letter-spacing: .02em;
  animation: ${slideIn} .18s ease-out;
`;

/* Inline remove-sound X (only visible when audio is loaded) */
export const RemoveSoundBtn = styled.button`
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  color: ${p => p.theme.colors.muted};
  transition: background .12s, color .12s, border-color .12s, transform .08s;
  margin-left: 2px;

  &:hover {
    background: rgba(248,113,113,.14);
    border-color: rgba(248,113,113,.35);
    color: #fca5a5;
  }
  &:active { transform: scale(.92); }
`;

/* ── Loading status ─────────────────────────────────────────────── */
export const LoadingChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.theme.colors.muted};
  letter-spacing: .005em;
  animation: ${fadeIn} .15s ease-out;
`;

export const InlineSpinner = styled.span`
  display: inline-block;
  width: 10px; height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.10);
  border-top-color: ${ACCENT};
  animation: ${spin} .75s linear infinite;
`;

/* ── Player Wrap (no card / no background) ─────────────────────── */
export const PlayerWrap = styled.div`
  position: relative;
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const WaveStage = styled.div`
  position: relative;
  width: 100%;
  height: 58px;
  padding: 0 6px;
  box-sizing: border-box;
`;

export const WaveCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  background: transparent;
`;

/* Subtle highlight layer for the SELECTED region (no side borders — handles mark edges) */
export const SelectionFill = styled.div`
  position: absolute;
  top: 6px; bottom: 6px;
  background: ${SEL_FILL};
  pointer-events: none;
  border-radius: 4px;
`;

/* Asymmetric edge markers — start = bracket facing right, end = bracket facing left.
   The vertical line sits exactly on the trim point; the rounded grip extends OUTWARD
   on each side, making it visually clear which side is the "edge". */
export const RangeHandle = styled.div<{ $side: 'start' | 'end'; $active: boolean }>`
  position: absolute;
  top: -2px; bottom: -2px;
  width: 12px;
  transform: translateX(${p => p.$side === 'start' ? '-100%' : '0'});
  cursor: ew-resize;
  z-index: 3;
  user-select: none;
  -webkit-user-select: none;

  /* the vertical accent line right at the trim point */
  &::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    ${p => p.$side === 'start' ? 'right: 0;' : 'left: 0;'}
    width: 2px;
    background: ${ACCENT};
    border-radius: 1px;
    transition: background .12s, width .12s;
  }

  /* asymmetric grip — sits on the OUTER side of the line, rounded on the outer end */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 5px; height: 22px;
    background: ${ACCENT};
    box-shadow: 0 1px 3px rgba(0,0,0,.28);
    transition: background-color .12s, width .12s, height .12s;

    ${p => p.$side === 'start' ? css`
      right: 2px;                            /* attach to left face of the line */
      border-radius: 3px 0 0 3px;            /* round only the outer (left) edge */
    ` : css`
      left: 2px;                             /* attach to right face of the line */
      border-radius: 0 3px 3px 0;            /* round only the outer (right) edge */
    `}
  }

  &:hover::before { background: ${ACCENT_DARK}; width: 2.5px; }
  &:hover::after  { background-color: ${ACCENT_DARK}; height: 26px; }

  ${p => p.$active && css`
    &::before { background: ${ACCENT_DARK}; width: 2.5px; }
    &::after  { background-color: ${ACCENT_DARK}; height: 28px; width: 6px; }
  `}
`;

/* Hairline playhead — crisp 1px white over the asymmetric bars.
   Position is driven imperatively at 60fps from the RAF draw loop, so we
   intentionally have NO CSS transition here — a transition would always
   lag one frame behind the true playback position. */
export const PlayheadLine = styled.div`
  position: absolute;
  top: 3px; bottom: 3px;
  width: 1px;
  background: #fff;
  transform: translateX(-50%);
  pointer-events: none;
  opacity: .92;
  z-index: 2;
  box-shadow: 0 0 0.5px rgba(0,0,0,.35);
  will-change: left;
`;

export const HoverLine = styled.div`
  position: absolute;
  top: 4px; bottom: 4px;
  width: 1px;
  background: rgba(255,255,255,.28);
  pointer-events: none;
  transform: translateX(-50%);
`;

export const HoverTime = styled.div`
  position: absolute;
  bottom: calc(100% + 5px);
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(15,15,20,.96);
  color: #e4e4e7;
  border: 1px solid rgba(255,255,255,.08);
  pointer-events: none;
  white-space: nowrap;
  letter-spacing: .02em;
  z-index: 4;
`;

/* ── Controls Row (everything in one minimal line) ────────────── */
export const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  letter-spacing: .015em;
`;

export const PlayBtn = styled.button<{ $playing: boolean }>`
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px;
  border-radius: 50%;
  border: none;
  cursor: pointer; flex-shrink: 0;
  background: ${p => p.$playing ? ACCENT : ACCENT_TINT};
  color: ${p => p.$playing ? '#fff' : '#c4b5fd'};
  transition: background .14s, color .14s, transform .08s;

  &:disabled {
    opacity: .35; cursor: not-allowed;
    background: rgba(255,255,255,.04); color: ${p => p.theme.colors.muted};
  }
  &:not(:disabled):hover {
    background: ${p => p.$playing ? ACCENT_DARK : 'rgba(139,92,246,.28)'};
    color: #fff;
  }
  &:not(:disabled):active { transform: scale(.94); }
`;

export const TimeText = styled.span`
  display: inline-flex; align-items: baseline;
  font-weight: 500;
  color: ${p => p.theme.colors.text};
  & .sep { opacity: .4; margin: 0 5px; color: ${p => p.theme.colors.muted}; }
  & .total { color: ${p => p.theme.colors.muted}; }
`;

export const TrimGroup = styled.div`
  display: inline-flex; align-items: center;
  gap: 6px;
  margin-left: auto;
  color: ${p => p.theme.colors.muted};
  font-weight: 500;
  & .arrow { opacity: .5; }
  & .val   { color: ${p => p.theme.colors.text}; font-weight: 600; }
`;

export const ResetTrimBtn = styled.button`
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  background: none; border: none; cursor: pointer;
  border-radius: 4px;
  color: ${p => p.theme.colors.muted};
  transition: color .12s, background .12s;
  &:hover { color: ${p => p.theme.colors.text}; background: rgba(255,255,255,.06); }
`;

/* ── Error ─────────────────────────────────────────────────────── */
export const ErrorBanner = styled.div`
  font-size: 11px;
  color: #f87171;
  background: rgba(248,113,113,.06);
  border: 1px solid rgba(248,113,113,.18);
  border-radius: 7px;
  padding: 5px 9px;
`;

/* ── Legacy aliases (other files still import these names) ─────── */
export const VideoInfoRow       = styled.div``;
export const VideoInfoCard      = styled.div``;
export const VideoNameRow       = styled.div``;
export const VideoDurationHint  = styled.span``;
export const PlatformGrid       = styled.div``;
export const PlatformIconBtn    = styled.div``;
export const PlatformLabel      = styled.span``;
export const AudioPlayerSection = styled.div``;
export const WaveformContainer  = styled.div``;
export const PlayerControls     = styled.div``;
export const LoadingOverlay     = styled.div``;
export const LoadingSpinner     = styled.div``;
export const LoadingText        = styled.span``;
export const PlatformIcon       = PlatformIconImg;
export const RangeSection       = styled.div``;
export const RangeRow           = styled.div``;
export const RangeLabel         = styled.span``;
export const RangeInput         = styled.input``;
export const TimeTag            = styled.span``;
export const VideoTitle         = VideoName;
export const PlatformChip       = styled.div``;
export const LoadingDots        = styled.span``;
export const SmallSpinner       = InlineSpinner;
export const LoadingSweepBar    = styled.div``;
export const Footer             = styled.div``;
export const AttachedBadge      = styled.div``;
export const AttachedClose      = styled.button``;
export const ConfirmBtn         = styled.button``;
export const TimeDisplay        = TimeText;
export const TimeMuted          = styled.span``;
export const TimeSep            = styled.span``;
export const TrimRow            = styled.div``;
export const TrimLabel          = styled.span``;
export const TrimRange          = styled.span``;
export const TrimChip           = styled.span``;
export const TrimDuration       = styled.span``;

/* Token re-exports for canvas drawing */
export const TOKENS = {
  ACCENT,
  ACCENT_DARK,
  ACCENT_LINE,
  BAR_DIM,
  BAR_OUT,
  SEL_FILL,
};
