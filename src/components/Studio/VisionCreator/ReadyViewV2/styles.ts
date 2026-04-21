import styled, { keyframes } from 'styled-components';

// ─── Animations ───────────────────────────────────────────────────────────────
export const fadeIn  = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
export const slideIn = keyframes`from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}`;
export const pulse   = keyframes`0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.6)}`;
export const spin    = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

// ─── Outer chrome ─────────────────────────────────────────────────────────────
export const ConsoleWrapper = styled.div`
  position:fixed;top:76px;left:0;right:0;bottom:0;
  display:flex;flex-direction:column;
  background:${p=>p.theme.colors.bg};
  z-index:10;
  animation:${fadeIn} .3s ease both;
`;

// ─── Top bar ──────────────────────────────────────────────────────────────────
export const TopBar = styled.div`
  height:60px;flex-shrink:0;
  display:flex;align-items:center;gap:12px;
  padding:0 24px;
  border-bottom:1px solid ${p=>p.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)'};
  background:${p=>p.theme.colors.surface};
  box-shadow:0 1px 6px ${p=>p.theme.mode==='dark'?'rgba(0,0,0,.3)':'rgba(0,0,0,.05)'};
`;

export const TopBarTitle = styled.div`
  flex:1;
  font-size:16px;font-weight:700;letter-spacing:-.4px;
  color:${p=>p.theme.colors.text};
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
`;

export const TopBarMeta = styled.div`
  display:flex;align-items:center;gap:8px;flex-shrink:0;
`;

export const VersionBadge = styled.div`
  padding:3px 9px;border-radius:999px;
  background:${p=>p.theme.colors.primaryLight};
  border:1px solid rgba(155,93,229,.2);
  font-size:10.5px;font-weight:700;
  color:${p=>p.theme.colors.primary};
  letter-spacing:.05em;
`;

export const TypeBadge = styled.div<{$speechless?:boolean}>`
  padding:3px 10px;border-radius:999px;
  background:${p=>p.$speechless?'rgba(100,116,139,.08)':'rgba(20,184,166,.08)'};
  border:1px solid ${p=>p.$speechless?'rgba(100,116,139,.2)':'rgba(20,184,166,.2)'};
  font-size:10.5px;font-weight:700;
  color:${p=>p.$speechless?'#64748b':'#0d9488'};
  letter-spacing:.04em;
`;

export const CategoryChip = styled.div`
  padding:3px 10px;border-radius:999px;
  background:rgba(251,191,36,.08);
  border:1px solid rgba(251,191,36,.2);
  font-size:10.5px;font-weight:700;
  color:#d97706;
  letter-spacing:.04em;
`;

export const ReadyDot = styled.div`
  width:7px;height:7px;border-radius:50%;
  background:#22c55e;box-shadow:0 0 8px #22c55e;
  animation:${pulse} 1.6s ease-in-out infinite;
`;

export const ReadyPill = styled.div`
  display:inline-flex;align-items:center;gap:5px;
  padding:3px 10px;border-radius:999px;
  background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.18);
  font-size:10.5px;font-weight:700;color:#16a34a;
  letter-spacing:.06em;text-transform:uppercase;
`;

// ─── Scene Timeline ────────────────────────────────────────────────────────────
export const TimelineWrapper = styled.div`
  height:48px;flex-shrink:0;
  display:flex;align-items:center;
  padding:0 24px;gap:10px;
  border-bottom:1px solid ${p=>p.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)'};
  background:${p=>p.theme.mode==='dark'?'rgba(0,0,0,.15)':'rgba(0,0,0,.02)'};
`;

export const TimelineTrack = styled.div`
  flex:1;display:flex;align-items:center;height:34px;
  border-radius:8px;overflow:hidden;gap:2px;
`;

export const TimelineSegment = styled.button<{$color:string;$active:boolean}>`
  display:flex;align-items:center;justify-content:center;
  height:100%;padding:0 10px;min-width:28px;
  border:none;cursor:pointer;font-family:inherit;
  background:${p=>p.$active?p.$color:`${p.$color}22`};
  color:${p=>p.$active?'white':p.$color};
  position:relative;gap:6px;flex-shrink:0;
  transition:background .2s,color .2s;
  &:hover{background:${p=>p.$active?p.$color:`${p.$color}3a`};}
`;

export const TimelineDot = styled.div<{$color:string;$active:boolean}>`
  width:${p=>p.$active?7:5}px;height:${p=>p.$active?7:5}px;
  border-radius:50%;flex-shrink:0;
  background:${p=>p.$active?'white':p.$color};
  box-shadow:${p=>p.$active?'0 0 6px rgba(255,255,255,.5)':'none'};
  opacity:${p=>p.$active?1:.7};
  transition:all .2s;
`;

export const TimelineSegmentLabel = styled.div<{$active:boolean}>`
  font-size:11px;font-weight:800;
  color:${p=>p.$active?'white':'inherit'};
  display:flex;align-items:center;gap:5px;
  white-space:nowrap;
`;

export const TimelineSegmentDur = styled.span`
  font-size:9.5px;font-weight:600;opacity:.75;
`;

export const TimelineEndDot = styled.div<{$color:string}>`
  width:6px;height:6px;border-radius:50%;flex-shrink:0;
  background:${p=>p.$color};opacity:.3;
`;

export const TimelineTotalLabel = styled.div`
  font-size:11px;font-weight:700;
  color:${p=>p.theme.colors.muted};opacity:.55;
  white-space:nowrap;letter-spacing:.02em;
`;

// ─── Split pane ───────────────────────────────────────────────────────────────
export const SplitPane = styled.div`flex:1;display:flex;overflow:hidden;`;

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export const Sidebar = styled.div`
  width:232px;flex-shrink:0;
  display:flex;flex-direction:column;
  border-right:1px solid ${p=>p.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)'};
  background:${p=>p.theme.colors.surface};
  overflow-y:auto;
  scrollbar-width:thin;scrollbar-color:rgba(155,93,229,.15) transparent;
`;

export const SidebarSection = styled.div`padding:14px 0 6px;`;

export const SidebarLabel = styled.div`
  padding:0 16px 8px;
  font-size:9.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:${p=>p.theme.colors.muted};opacity:.5;
`;

export const NavItem = styled.button<{$active:boolean;$color?:string}>`
  width:100%;display:flex;align-items:center;gap:10px;
  padding:10px 16px;border:none;cursor:pointer;
  background:none;font-family:inherit;text-align:left;position:relative;
  color:${p=>p.$active?p.theme.colors.text:p.theme.colors.muted};
  background:${p=>p.$active
    ?(p.$color?`${p.$color}12`:p.theme.colors.primaryLight)
    :'transparent'};
  transition:color .15s,background .15s;
  &::before{
    content:'';position:absolute;left:0;top:6px;bottom:6px;width:3px;
    border-radius:0 3px 3px 0;
    background:${p=>p.$color||p.theme.colors.primary};
    opacity:${p=>p.$active?1:0};transition:opacity .2s;
  }
  &:hover{
    background:${p=>p.$color?`${p.$color}0a`:p.theme.colors.primaryLight};
    color:${p=>p.theme.colors.text};
  }
`;

export const NavIcon = styled.div<{$active:boolean;$color?:string}>`
  width:30px;height:30px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:14px;border-radius:8px;
  background:${p=>p.$active
    ?(p.$color?`${p.$color}18`:p.theme.colors.primaryLight)
    :(p.theme.mode==='dark'?'rgba(255,255,255,.04)':'rgba(0,0,0,.04)')};
  transition:background .15s;
`;

export const NavLabel = styled.div`font-size:13px;font-weight:600;`;

export const SidebarDivider = styled.div`
  height:1px;
  background:${p=>p.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)'};
  margin:6px 16px;
`;

export const SceneCountLabel = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  padding:6px 16px 5px;
  font-size:9.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:${p=>p.theme.colors.muted};opacity:.5;
`;

export const SceneTile = styled.button<{$active:boolean;$color?:string}>`
  width:100%;display:flex;align-items:center;gap:9px;
  padding:8px 16px;border:none;cursor:pointer;
  font-family:inherit;text-align:left;position:relative;
  background:${p=>p.$active?(p.$color?`${p.$color}10`:'rgba(245,158,11,.07)'):'transparent'};
  transition:background .15s;
  &::before{
    content:'';position:absolute;left:0;top:4px;bottom:4px;width:3px;
    border-radius:0 3px 3px 0;
    background:${p=>p.$color||'#f59e0b'};
    opacity:${p=>p.$active?1:0};transition:opacity .15s;
  }
  &:hover{background:${p=>p.$color?`${p.$color}08`:'rgba(245,158,11,.04)'};}
`;

export const SceneTileNum = styled.div<{$active:boolean;$color?:string}>`
  width:22px;height:22px;border-radius:6px;flex-shrink:0;
  background:${p=>p.$active
    ?(p.$color||'#f59e0b')
    :(p.theme.mode==='dark'?'rgba(255,255,255,.07)':'rgba(0,0,0,.06)')};
  display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:800;
  color:${p=>p.$active?'white':p.theme.colors.muted};
  transition:background .15s,color .15s;
`;

export const SceneTileInfo = styled.div`flex:1;min-width:0;`;

export const SceneTilePrompt = styled.div<{$active:boolean}>`
  font-size:11.5px;font-weight:500;
  color:${p=>p.$active?p.theme.colors.text:p.theme.colors.muted};
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  transition:color .15s;
`;

export const DurationChip = styled.div<{$color?:string}>`
  font-size:9.5px;font-weight:700;padding:1px 6px;border-radius:4px;
  background:${p=>p.$color?`${p.$color}14`:'rgba(245,158,11,.1)'};
  color:${p=>p.$color||'#d97706'};
  border:1px solid ${p=>p.$color?`${p.$color}28`:'rgba(245,158,11,.15)'};
  margin-top:2px;display:inline-block;
`;

// ─── Content panel ────────────────────────────────────────────────────────────
export const ContentPanel = styled.div`
  flex:1;display:flex;flex-direction:column;overflow:hidden;
  background:${p=>p.theme.colors.bg};
`;

export const ContentInner = styled.div`
  flex:1;overflow-y:auto;padding:32px 40px;
  scrollbar-width:thin;scrollbar-color:rgba(155,93,229,.15) transparent;
  animation:${slideIn} .28s cubic-bezier(.4,0,.2,1) both;
`;

export const SectionHeading = styled.div`
  display:flex;align-items:center;gap:14px;
  margin-bottom:24px;padding-bottom:18px;
  border-bottom:1px solid ${p=>p.theme.mode==='dark'?'rgba(255,255,255,.07)':'rgba(0,0,0,.07)'};
`;

export const HeadingIcon = styled.div<{$color?:string}>`
  width:44px;height:44px;border-radius:12px;flex-shrink:0;
  background:${p=>p.$color?`${p.$color}14`:p.theme.colors.primaryLight};
  border:1px solid ${p=>p.$color?`${p.$color}28`:'rgba(155,93,229,.15)'};
  display:flex;align-items:center;justify-content:center;font-size:18px;
`;

export const HeadingText = styled.div<{$color?:string}>`
  font-size:22px;font-weight:800;letter-spacing:-.5px;
  color:${p=>p.$color||p.theme.colors.primary};
`;

export const HeadingSubtext = styled.div`
  font-size:12.5px;color:${p=>p.theme.colors.muted};margin-top:3px;
`;

// ─── Field card ───────────────────────────────────────────────────────────────
export const FieldCard = styled.div<{$color?:string}>`
  background:${p=>p.theme.colors.surface};
  border:1.5px solid ${p=>p.theme.mode==='dark'?'rgba(255,255,255,.07)':'rgba(0,0,0,.07)'};
  border-radius:14px;padding:16px 18px;
  box-shadow:${p=>p.theme.shadows.sm};
  margin-bottom:14px;
`;

export const FieldLabel = styled.div`
  font-size:9.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:${p=>p.theme.colors.muted};margin-bottom:10px;opacity:.65;
`;

// ─── Read-only display ────────────────────────────────────────────────────────
export const ReadOnlyText = styled.div<{$italic?:boolean}>`
  font-size:13.5px;line-height:1.75;
  color:${p=>p.theme.colors.text};
  font-style:${p=>p.$italic?'italic':'normal'};
  white-space:pre-wrap;word-break:break-word;
`;

export const ReadOnlyPlaceholder = styled.span`
  color:${p=>p.theme.colors.muted};opacity:.4;font-style:italic;
`;

// ─── Voice ────────────────────────────────────────────────────────────────────
export const VoiceSection = styled.div`display:flex;flex-direction:column;gap:0;`;

export const GenderDisplay = styled.div`display:flex;gap:10px;`;

export const GenderBadge = styled.div<{$active:boolean;$gender:string}>`
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 22px;border-radius:12px;
  border:1.5px solid ${p=>{
    if (!p.$active) return p.theme.mode==='dark'?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)';
    return p.$gender==='MALE'?'rgba(59,130,246,.35)':'rgba(236,72,153,.35)';
  }};
  background:${p=>{
    if (!p.$active) return 'transparent';
    return p.$gender==='MALE'?'rgba(59,130,246,.08)':'rgba(236,72,153,.08)';
  }};
  color:${p=>{
    if (!p.$active) return p.theme.colors.muted;
    return p.$gender==='MALE'?'#3b82f6':'#ec4899';
  }};
  font-size:13px;font-weight:700;
  opacity:${p=>p.$active?1:.45};
  transition:all .18s;
`;

export const GenderIcon = styled.span`
  font-size:20px;line-height:1;
`;

// ─── Scene panel ──────────────────────────────────────────────────────────────
export const SceneTabs = styled.div`
  display:flex;gap:6px;margin-bottom:22px;flex-wrap:wrap;
`;

export const SceneTab = styled.button<{$active:boolean;$color?:string}>`
  width:32px;height:32px;border-radius:9px;
  border:1.5px solid ${p=>p.$active
    ?(p.$color?`${p.$color}50`:'rgba(245,158,11,.4)')
    :(p.theme.mode==='dark'?'rgba(255,255,255,.1)':'rgba(0,0,0,.1)')};
  background:${p=>p.$active
    ?(p.$color?`${p.$color}14`:'rgba(245,158,11,.1)')
    :'transparent'};
  color:${p=>p.$active?(p.$color||'#d97706'):p.theme.colors.muted};
  font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;
  transition:all .15s;
  &:hover{
    border-color:${p=>p.$color?`${p.$color}40`:'rgba(245,158,11,.3)'};
    background:${p=>p.$color?`${p.$color}0c`:'rgba(245,158,11,.06)'};
  }
`;

export const SceneFieldGroup = styled.div`display:flex;flex-direction:column;`;

export const DurationDisplay = styled.div`display:flex;align-items:baseline;gap:8px;`;

export const DurationValue = styled.div`
  font-size:36px;font-weight:800;letter-spacing:-.02em;
  color:${p=>p.theme.colors.text};line-height:1;
`;

export const DurationUnit = styled.span`
  font-size:14px;font-weight:600;color:${p=>p.theme.colors.muted};
`;

// ─── Bottom bar ───────────────────────────────────────────────────────────────
export const BottomBar = styled.div`
  flex-shrink:0;
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 20px;gap:14px;
  border-top:1px solid ${p=>p.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)'};
  background:${p=>p.theme.colors.surface};
  box-shadow:0 -1px 8px ${p=>p.theme.mode==='dark'?'rgba(0,0,0,.28)':'rgba(0,0,0,.06)'};
`;

export const PromptSlotWrap = styled.div`
  flex:1;min-width:0;
  /* Tighten the card styling of the embedded PromptBox */
  & > div {
    border-radius:12px;
    box-shadow:none !important;
    border-color:${p=>p.theme.mode==='dark'?'rgba(139,92,246,.18)':'rgba(139,92,246,.15)'} !important;
    &:hover { box-shadow: none !important; }
  }
`;

export const StatusText = styled.div`
  font-size:12px;color:${p=>p.theme.colors.primary};
  font-weight:600;white-space:nowrap;opacity:.7;
`;

export const GenerateBtn = styled.button<{$loading:boolean}>`
  display:inline-flex;align-items:center;gap:8px;
  padding:13px 30px;border-radius:12px;border:none;cursor:pointer;
  font-size:13.5px;font-weight:700;font-family:inherit;flex-shrink:0;
  background:linear-gradient(135deg,#9b5de5,#14b8a6);
  color:white;
  box-shadow:0 4px 20px rgba(155,93,229,.35);
  transition:all .22s cubic-bezier(.4,0,.2,1);
  opacity:${p=>p.$loading?.7:1};
  &:hover:not(:disabled){
    transform:translateY(-2px);
    box-shadow:0 7px 26px rgba(155,93,229,.5);
  }
  &:active{transform:translateY(0);}
  &:disabled{cursor:default;}
`;

export const BtnSpinner = styled.div`
  width:13px;height:13px;
  border:2px solid rgba(255,255,255,.3);
  border-top-color:white;border-radius:50%;
  animation:${spin} .65s linear infinite;
`;
