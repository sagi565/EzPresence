import styled, { keyframes, css } from 'styled-components';

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0);    }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const slideInFromRight = keyframes`
  from { opacity: 0; transform: translateX(10px); }
  to   { opacity: 1; transform: translateX(0);    }
`;
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const ACCENT      = '#f59e0b';
const ACCENT_DARK = '#d97706';
const ACCENT_LINE = 'rgba(245,158,11,.28)';
const BAR_IN      = 'rgba(88,86,120,.95)';
const BAR_OUT     = 'rgba(120,118,158,.72)';

export const TOKENS = { ACCENT, ACCENT_DARK, ACCENT_LINE, BAR_IN, BAR_OUT };

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

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 22px;
`;

export const PlatformRow = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const PlatformIconImg = styled.img<{ $active: boolean; $small?: boolean; $visible?: boolean }>`
  width:  ${p => p.$small ? '17px' : '20px'};
  height: ${p => p.$small ? '17px' : '20px'};
  object-fit: contain;
  flex-shrink: 0;
  user-select: none;
  -webkit-user-drag: none;
  opacity: ${p => (p.$visible === false ? 0 : (p.$active ? 1 : .62))};
  filter: ${p => p.$active ? 'none' : 'grayscale(.55)'};
  max-width: ${p => p.$visible === false ? '0px' : (p.$small ? '17px' : '20px')};
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
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,.15);
  border-top-color: ${ACCENT};
  animation: ${spin} .75s linear infinite;
`;

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
  height: 70px;
  overflow-x: scroll;
  overflow-y: hidden;
  box-sizing: border-box;

  /* Hide the native scrollbar — we render a custom always-visible one below. */
  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
`;

/* Custom scrollbar — minimalist, dark grey, always visible. The cursor
   intentionally stays as default during interaction so dragging the scroll
   thumb doesn't shift the cursor shape. */
export const ScrollbarTrack = styled.div`
  position: relative;
  width: 100%;
  height: 5px;
  background: rgba(255,255,255,.04);
  border-radius: 3px;
  margin-top: 5px;
  cursor: default;
`;

export const ScrollbarThumb = styled.div<{ $disabled: boolean }>`
  position: absolute;
  top: 0; bottom: 0;
  background: ${p => p.$disabled ? 'rgba(120,120,128,.20)' : 'rgba(120,120,128,.55)'};
  border-radius: 3px;
  cursor: default;
  min-width: 18px;
`;

export const WaveInner = styled.div`
  position: relative;
  height: 100%;
  padding: 0 6px;
  box-sizing: border-box;
  min-width: 100%;
`;

export const WaveCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  background: transparent;
`;

export const TrimFill = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(251,146,60,.11);
  border-left: 1px solid rgba(251,146,60,.22);
  border-right: 1px solid rgba(251,146,60,.22);
  pointer-events: none;
  z-index: 1;
`;

export const RangeHandle = styled.div<{ $side: 'start' | 'end'; $active: boolean; $readonly?: boolean }>`
  position: absolute;
  top: -2px; bottom: -2px;
  width: 12px;
  transform: translateX(${p => p.$side === 'start' ? '-100%' : '0'});
  cursor: ${p => p.$readonly ? 'default' : 'ew-resize'};
  z-index: 3;
  user-select: none;
  -webkit-user-select: none;

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

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 5px; height: 22px;
    background: ${ACCENT_DARK};
    box-shadow: 0 1px 3px rgba(0,0,0,.28);
    transition: background-color .12s, width .12s, height .12s;

    ${p => p.$side === 'start' ? css`
      right: 2px;
      border-radius: 3px 0 0 3px;
    ` : css`
      left: 2px;
      border-radius: 0 3px 3px 0;
    `}
  }

  &:hover::before { background: ${ACCENT_DARK}; width: 2.5px; }
  &:hover::after  { background-color: ${ACCENT_DARK}; height: 26px; }

  ${p => p.$active && css`
    &::before { background: ${ACCENT_DARK}; width: 2.5px; }
    &::after  { background-color: ${ACCENT_DARK}; height: 28px; width: 6px; }
  `}
`;

export const PlayheadLine = styled.div`
  position: absolute;
  top: 3px; bottom: 3px;
  width: 1px;
  background: transparent;
  transform: translateX(-50%);
  pointer-events: none;
  opacity: .92;
  z-index: 5;
  box-shadow: 0 0 1px rgba(0,0,0,.5);
  will-change: left;
`;

export const PlayheadHandle = styled.div<{ $readonly?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px; height: 15px;
  background: #ff4900;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: ${p => p.$readonly ? 'default' : 'grab'};
  box-shadow: 0 2px 6px rgba(0,0,0,.45);
  pointer-events: auto;
  border: 2px solid #fff;
  transition: transform .1s, box-shadow .1s;

  &:hover { transform: translate(-50%, -50%) scale(1.18); box-shadow: 0 2px 8px rgba(255,73,0,.5); }
  &:active { cursor: grabbing; transform: translate(-50%, -50%) scale(1.05); }
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
  background: rgba(245,158,11,.20);
  color: #fbbf24;
  transition: background .14s, color .14s, transform .08s, box-shadow .14s;

  &:disabled {
    opacity: .35; cursor: not-allowed;
    background: rgba(255,255,255,.04); color: ${p => p.theme.colors.muted};
  }
  &:not(:disabled):hover {
    background: rgba(245,158,11,.50);
    color: #78350f;
    box-shadow: 0 0 0 3px rgba(245,158,11,.28);
  }
  &:not(:disabled):active {
    background: rgba(245,158,11,.55);
    color: #78350f;
    box-shadow: 0 0 0 3px rgba(245,158,11,.28);
    transform: scale(.92);
  }
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

export const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #ef4444;
  background: rgba(239,68,68,.08);
  border: 1px solid rgba(239,68,68,.2);
  border-radius: 8px;
  padding: 10px 14px;
  margin-top: 4px;
`;
