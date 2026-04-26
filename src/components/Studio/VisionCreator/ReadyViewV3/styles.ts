import styled, { keyframes } from 'styled-components';

// ─── Animations ───────────────────────────────────────────────────────────────
export const fadeUp   = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
export const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
export const slideIn  = keyframes`from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}`;
export const pulse    = keyframes`0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.6)}`;
export const spin     = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
export const shimmer  = keyframes`
  0%   { background-position: -200% center }
  100% { background-position:  200% center }
`;
export const cardPop  = keyframes`
  0%   { opacity:0; transform:scale(.93) translateY(8px) }
  100% { opacity:1; transform:scale(1)  translateY(0)    }
`;
export const glowPulse = keyframes`
  0%,100% { opacity: .55 }
  50%      { opacity: .9  }
`;

// ─── Outer container ──────────────────────────────────────────────────────────
export const StageWrapper = styled.div`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  display: flex; flex-direction: column;
  background: ${p => p.theme.colors.bg};
  z-index: 10;
  overflow: hidden;
  animation: ${fadeIn} .25s ease both;
`;

// ─── Ambient colour layers ────────────────────────────────────────────────────
export const AmbientLayer = styled.div<{ $color: string; $visible: boolean }>`
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(ellipse 70% 60% at 60% 40%, ${p => p.$color}14 0%, transparent 70%);
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: opacity .55s cubic-bezier(.4,0,.2,1);
`;

// ─── Top bar ──────────────────────────────────────────────────────────────────
export const TopBar = styled.div`
  position: relative; z-index: 2; flex-shrink: 0;
  height: 58px; display: flex; align-items: center; gap: 12px; padding: 0 24px;
  border-bottom: 1px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.07)'};
  background: ${p => p.theme.colors.surface};
  box-shadow: 0 1px 8px ${p => p.theme.mode === 'dark' ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.06)'};
`;

export const TopBarTitle = styled.input`
  flex: 1; background: transparent; border: none; outline: none;
  font-size: 15px; font-weight: 700; letter-spacing: -.3px;
  color: ${p => p.theme.colors.text}; font-family: inherit;
  caret-color: ${p => p.theme.colors.primary};
  &::placeholder { color: ${p => p.theme.colors.muted}; opacity: .4; }
`;

export const TopBarMeta = styled.div`
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
`;

export const VersionBadge = styled.div`
  padding: 3px 9px; border-radius: 999px;
  background: ${p => p.theme.colors.primaryLight};
  border: 1px solid rgba(155,93,229,.2);
  font-size: 10.5px; font-weight: 700;
  color: ${p => p.theme.colors.primary};
  letter-spacing: .05em;
`;

export const ReadyDot = styled.div`
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e; box-shadow: 0 0 8px #22c55e;
  animation: ${pulse} 1.6s ease-in-out infinite;
`;

export const ChangedDot = styled.div`
  width: 7px; height: 7px; border-radius: 50%;
  background: #f59e0b; box-shadow: 0 0 7px #f59e0b;
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

export const ReadyPill = styled.div`
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 999px;
  background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.18);
  font-size: 10.5px; font-weight: 700; color: #16a34a;
  letter-spacing: .06em; text-transform: uppercase;
`;

export const SaveBtn = styled.button`
  padding: 6px 16px; border-radius: 8px;
  border: 1px solid rgba(155,93,229,.2); cursor: pointer;
  font-size: 12px; font-weight: 700; font-family: inherit;
  background: ${p => p.theme.colors.primaryLight};
  color: ${p => p.theme.colors.primary};
  transition: all .18s;
  &:hover { background: rgba(155,93,229,.12); border-color: rgba(155,93,229,.35); }
  &:disabled { opacity: .35; cursor: default; }
`;

// ─── Section tabs bar ─────────────────────────────────────────────────────────
export const TabsBar = styled.div`
  position: relative; z-index: 2; flex-shrink: 0;
  display: flex;
  border-bottom: 1px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)'};
  background: ${p => p.theme.colors.surface};
`;

export const SectionTab = styled.button<{ $active: boolean; $color: string }>`
  flex: 1; display: flex; flex-direction: column; align-items: flex-start;
  gap: 3px; padding: 12px 20px 0; border: none; cursor: pointer;
  background: ${p => p.$active
    ? (p.theme.mode === 'dark' ? `${p.$color}0d` : `${p.$color}08`)
    : 'transparent'};
  font-family: inherit; position: relative; overflow: hidden;
  transition: background .22s;
  &:hover { background: ${p => p.$active
    ? (p.theme.mode === 'dark' ? `${p.$color}12` : `${p.$color}0b`)
    : (p.theme.mode === 'dark' ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.02)')}; }
  & + & { border-left: 1px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'}; }
`;

export const TabRow = styled.div`
  display: flex; align-items: center; gap: 8px; width: 100%;
`;

export const TabEmoji = styled.div<{ $active: boolean; $color: string }>`
  width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 14px;
  background: ${p => p.$active
    ? `${p.$color}20`
    : (p.theme.mode === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)')};
  transition: background .22s, transform .22s;
  transform: ${p => p.$active ? 'scale(1.08)' : 'scale(1)'};
`;

export const TabInfo = styled.div`
  flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px;
`;

export const TabName = styled.div<{ $active: boolean; $color: string }>`
  font-size: 12.5px; font-weight: 700; letter-spacing: -.2px;
  color: ${p => p.$active ? p.$color : p.theme.colors.muted};
  transition: color .22s;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

export const TabPreview = styled.div`
  font-size: 10px; font-weight: 400;
  color: ${p => p.theme.colors.muted}; opacity: .6;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 100%;
`;

export const TabBadge = styled.div<{ $color: string }>`
  flex-shrink: 0; min-width: 18px; height: 18px; border-radius: 999px;
  padding: 0 6px;
  background: ${p => `${p.$color}18`};
  border: 1px solid ${p => `${p.$color}28`};
  color: ${p => p.$color};
  font-size: 9.5px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
`;

export const TabProgressBar = styled.div<{ $pct: number; $color: string; $active: boolean }>`
  width: 100%; height: 3px; margin-top: 10px; border-radius: 0;
  background: ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'};
  overflow: hidden; position: relative;
  &::after {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: ${p => Math.min(p.$pct * 100, 100)}%;
    background: ${p => p.$active
      ? `linear-gradient(90deg, ${p.$color}99, ${p.$color})`
      : `${p.$color}50`};
    transition: width .4s cubic-bezier(.4,0,.2,1), background .3s;
    border-radius: 0;
  }
`;

// ─── Stage content area ───────────────────────────────────────────────────────
export const StageArea = styled.div`
  flex: 1; overflow: hidden; position: relative; z-index: 1;
  display: flex; flex-direction: column;
`;

export const SectionPane = styled.div`
  flex: 1; display: flex; flex-direction: column; overflow: hidden;
  padding: 32px 48px 24px;
  animation: ${slideIn} .3s cubic-bezier(.4,0,.2,1) both;
  @media (max-width: 900px) { padding: 24px 24px 16px; }
`;

// ─── Section hero ─────────────────────────────────────────────────────────────
export const SectionHeroRow = styled.div`
  display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
`;

export const HeroEmoji = styled.div<{ $color: string }>`
  width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 22px;
  background: ${p => `${p.$color}15`};
  border: 1.5px solid ${p => `${p.$color}28`};
  box-shadow: 0 4px 16px ${p => `${p.$color}20`};
`;

export const HeroTextGroup = styled.div`flex: 1; min-width: 0;`;

export const SectionTitle = styled.div<{ $color: string }>`
  font-size: 26px; font-weight: 800; letter-spacing: -.7px; line-height: 1.1;
  color: ${p => p.$color};
`;

export const SectionSubtext = styled.div`
  font-size: 12.5px; color: ${p => p.theme.colors.muted}; margin-top: 4px; line-height: 1.4;
`;

export const CharArcWrap = styled.div`
  flex-shrink: 0; display: flex; flex-direction: column; align-items: center;
  gap: 3px; color: ${p => p.theme.colors.muted};
`;

// ─── Big text area ────────────────────────────────────────────────────────────
export const TextFieldWrap = styled.div<{ $color: string }>`
  flex: 1; display: flex; flex-direction: column; min-height: 0;
  background: ${p => p.theme.colors.surface};
  border: 1.5px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)'};
  border-radius: 18px;
  box-shadow: ${p => p.theme.shadows.md};
  overflow: hidden; position: relative;
  transition: border-color .22s, box-shadow .22s;
  &:focus-within {
    border-color: ${p => `${p.$color}50`};
    box-shadow: 0 0 0 3px ${p => `${p.$color}10`}, ${p => p.theme.shadows.md};
  }
`;

export const BigTextarea = styled.textarea`
  flex: 1; width: 100%; resize: none;
  background: transparent; border: none; outline: none;
  padding: 24px 28px;
  font-size: 15px; line-height: 1.8; font-family: inherit;
  color: ${p => p.theme.colors.text};
  caret-color: ${p => p.theme.colors.primary};
  scrollbar-width: thin; scrollbar-color: rgba(155,93,229,.15) transparent;
  &::placeholder {
    color: ${p => p.theme.colors.muted}; opacity: .35;
    font-size: 14px; font-style: italic;
  }
`;

export const FieldFooter = styled.div`
  display: flex; align-items: center; justify-content: flex-end;
  padding: 10px 16px 14px 16px; gap: 10px;
`;

export const CharLabel = styled.span<{ $warn: boolean }>`
  font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums;
  color: ${p => p.$warn ? '#f59e0b' : p.theme.colors.muted};
  opacity: ${p => p.$warn ? .9 : .45};
  transition: color .2s, opacity .2s;
`;

// ─── Voice section extras ─────────────────────────────────────────────────────
export const GenderRow = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 0 28px 18px;
  border-top: 1px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'};
  padding-top: 14px;
`;

export const GenderLabel = styled.div`
  font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  color: ${p => p.theme.colors.muted}; opacity: .5; margin-right: 4px;
`;

export const GenderBtn = styled.button<{ $active: boolean }>`
  padding: 7px 18px; border-radius: 999px; cursor: pointer; font-family: inherit;
  font-size: 11.5px; font-weight: 700; transition: all .18s;
  border: 1.5px solid ${p => p.$active ? 'rgba(236,72,153,.4)' : (p.theme.mode === 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)')};
  background: ${p => p.$active ? 'rgba(236,72,153,.1)' : 'transparent'};
  color: ${p => p.$active ? '#ec4899' : p.theme.colors.muted};
  &:hover { border-color: rgba(236,72,153,.32); background: rgba(236,72,153,.06); }
`;

// ─── Scenes layout ────────────────────────────────────────────────────────────
export const ScenesPane = styled.div`
  flex: 1; display: flex; flex-direction: column; overflow: hidden;
  animation: ${slideIn} .3s cubic-bezier(.4,0,.2,1) both;
`;

export const FilmStripHeader = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 20px 48px 14px;
  @media (max-width: 900px) { padding: 16px 24px 10px; }
`;

export const FilmStripTitle = styled.div`
  font-size: 20px; font-weight: 800; letter-spacing: -.5px;
  color: ${p => p.theme.colors.text};
`;

export const FilmStripCount = styled.div`
  padding: 3px 10px; border-radius: 999px;
  background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.2);
  font-size: 10.5px; font-weight: 800; color: #d97706; letter-spacing: .06em;
`;

export const FilmStrip = styled.div`
  display: flex; gap: 12px; overflow-x: auto; flex-shrink: 0;
  padding: 8px 48px 20px;
  scroll-snap-type: x mandatory; scroll-behavior: smooth;
  scrollbar-width: thin; scrollbar-color: rgba(245,158,11,.2) transparent;
  @media (max-width: 900px) { padding: 8px 24px 16px; }
`;

export const SceneCard = styled.button<{ $active: boolean }>`
  flex-shrink: 0; width: 172px; display: flex; flex-direction: column; gap: 8px;
  padding: 14px 14px 12px; border-radius: 14px; cursor: pointer; text-align: left;
  font-family: inherit; position: relative; scroll-snap-align: start;
  border: 1.5px solid ${p => p.$active
    ? 'rgba(245,158,11,.45)'
    : (p.theme.mode === 'dark' ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)')};
  background: ${p => p.$active
    ? (p.theme.mode === 'dark' ? 'rgba(245,158,11,.09)' : 'rgba(245,158,11,.06)')
    : p.theme.colors.surface};
  box-shadow: ${p => p.$active
    ? '0 4px 18px rgba(245,158,11,.2)'
    : p.theme.shadows.sm};
  transition: all .22s cubic-bezier(.4,0,.2,1);
  transform: ${p => p.$active ? 'translateY(-2px)' : 'none'};
  &:hover:not([data-active=true]) {
    border-color: rgba(245,158,11,.25);
    transform: translateY(-1px);
  }
  animation: ${cardPop} .3s cubic-bezier(.4,0,.2,1) both;
`;

export const SceneCardNum = styled.div<{ $active: boolean }>`
  width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800;
  background: ${p => p.$active
    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
    : (p.theme.mode === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)')};
  color: ${p => p.$active ? 'white' : p.theme.colors.muted};
  transition: background .22s, color .22s;
`;

export const SceneCardSnippet = styled.div<{ $active: boolean }>`
  font-size: 11.5px; font-weight: 500; line-height: 1.5;
  color: ${p => p.$active ? p.theme.colors.text : p.theme.colors.muted};
  overflow: hidden; display: -webkit-box;
  -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  flex: 1; transition: color .22s;
`;

export const SceneDurChip = styled.div`
  align-self: flex-start;
  font-size: 9.5px; font-weight: 700; padding: 2px 8px; border-radius: 5px;
  background: rgba(245,158,11,.1); color: #d97706;
  border: 1px solid rgba(245,158,11,.18);
`;

// ─── Scene detail panel ───────────────────────────────────────────────────────
export const SceneDetailWrap = styled.div`
  flex: 1; overflow-y: auto; padding: 4px 48px 24px;
  scrollbar-width: thin; scrollbar-color: rgba(245,158,11,.18) transparent;
  animation: ${fadeUp} .3s cubic-bezier(.4,0,.2,1) both;
  @media (max-width: 900px) { padding: 4px 24px 16px; }
`;

export const SceneDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 14px;
  align-items: start;
`;

export const SceneFieldBlock = styled.div`
  background: ${p => p.theme.colors.surface};
  border: 1.5px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)'};
  border-radius: 14px; padding: 14px 16px;
  transition: border-color .22s, box-shadow .22s;
  &:focus-within {
    border-color: rgba(245,158,11,.4);
    box-shadow: 0 0 0 3px rgba(245,158,11,.08);
  }
`;

export const InlineLabel = styled.div`
  font-size: 9.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  color: ${p => p.theme.colors.muted}; opacity: .55; margin-bottom: 8px;
`;

export const DurInput = styled.input`
  background: transparent; border: none; outline: none; padding: 0;
  font-size: 36px; font-weight: 800; color: ${p => p.theme.colors.text};
  font-family: inherit; caret-color: #f59e0b; width: 80px; text-align: center;
  &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { -webkit-appearance: none; }
  -moz-appearance: textfield;
`;

export const DurUnit = styled.span`
  font-size: 13px; font-weight: 600; color: ${p => p.theme.colors.muted};
`;

export const SceneTextarea = styled.textarea`
  width: 100%; resize: none; background: transparent; border: none; outline: none; padding: 0;
  font-size: 13px; line-height: 1.7; font-family: inherit; color: ${p => p.theme.colors.text};
  caret-color: #f59e0b; min-height: 80px;
  scrollbar-width: thin; scrollbar-color: rgba(245,158,11,.15) transparent;
  &::placeholder { color: ${p => p.theme.colors.muted}; opacity: .4; font-style: italic; }
`;

export const SceneCharRow = styled.div`
  display: flex; justify-content: flex-end; margin-top: 6px;
`;

export const SceneCharLabel = styled.span<{ $warn: boolean }>`
  font-size: 9.5px; font-weight: 700;
  color: ${p => p.$warn ? '#f59e0b' : p.theme.colors.muted};
  opacity: ${p => p.$warn ? .85 : .4};
  transition: color .2s;
`;

// ─── Bottom bar ───────────────────────────────────────────────────────────────
export const BottomBar = styled.div`
  position: relative; z-index: 2; flex-shrink: 0;
  height: 70px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; gap: 12px;
  border-top: 1px solid ${p => p.theme.mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.07)'};
  background: ${p => p.theme.colors.surface};
  box-shadow: 0 -1px 8px ${p => p.theme.mode === 'dark' ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.06)'};
`;

export const BottomLeft = styled.div`flex: 1; min-width: 0;`;

export const StatusText = styled.div`
  font-size: 12px; color: ${p => p.theme.colors.primary};
  font-weight: 600; white-space: nowrap; opacity: .7;
`;

export const GenerateBtn = styled.button<{ $loading: boolean; $hasChanges: boolean }>`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 30px; border-radius: 12px; border: none; cursor: pointer;
  font-size: 13.5px; font-weight: 700; font-family: inherit; flex-shrink: 0;
  background: ${p => p.$hasChanges
    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
    : 'linear-gradient(135deg, #9b5de5, #14b8a6)'};
  color: white;
  box-shadow: ${p => p.$hasChanges
    ? '0 4px 18px rgba(245,158,11,.35)'
    : '0 4px 20px rgba(155,93,229,.35)'};
  transition: all .22s cubic-bezier(.4,0,.2,1);
  opacity: ${p => p.$loading ? .7 : 1};
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${p => p.$hasChanges
      ? '0 7px 24px rgba(245,158,11,.48)'
      : '0 7px 26px rgba(155,93,229,.5)'};
  }
  &:active { transform: translateY(0); }
  &:disabled { cursor: default; }
`;

export const BtnSpinner = styled.div`
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: white; border-radius: 50%;
  animation: ${spin} .65s linear infinite;
`;
