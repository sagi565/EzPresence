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

export const TopBarTitle = styled.input`
  flex:1;background:transparent;border:none;outline:none;
  font-size:15px;font-weight:700;letter-spacing:-.3px;
  color:${p=>p.theme.colors.text};font-family:inherit;
  caret-color:${p=>p.theme.colors.primary};
  &::placeholder{color:${p=>p.theme.colors.muted};opacity:.4;}
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

export const ReadyDot = styled.div`
  width:7px;height:7px;border-radius:50%;
  background:#22c55e;box-shadow:0 0 8px #22c55e;
  animation:${pulse} 1.6s ease-in-out infinite;
`;

export const ChangedDot = styled.div`
  width:7px;height:7px;border-radius:50%;
  background:#f59e0b;box-shadow:0 0 7px #f59e0b;
  animation:${pulse} 1.2s ease-in-out infinite;
`;

export const ReadyPill = styled.div`
  display:inline-flex;align-items:center;gap:5px;
  padding:3px 10px;border-radius:999px;
  background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.18);
  font-size:10.5px;font-weight:700;color:#16a34a;
  letter-spacing:.06em;text-transform:uppercase;
`;

export const SaveBtn = styled.button`
  padding:6px 16px;border-radius:8px;
  border:1px solid rgba(155,93,229,.2);
  cursor:pointer;font-size:12px;font-weight:700;font-family:inherit;
  background:${p=>p.theme.colors.primaryLight};
  color:${p=>p.theme.colors.primary};
  transition:all .18s;
  &:hover{background:rgba(155,93,229,.12);border-color:rgba(155,93,229,.35);}
  &:disabled{opacity:.35;cursor:default;}
`;

// ─── Split pane ───────────────────────────────────────────────────────────────
export const SplitPane = styled.div`flex:1;display:flex;overflow:hidden;`;

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export const Sidebar = styled.div`
  width:240px;flex-shrink:0;
  display:flex;flex-direction:column;
  border-right:1px solid ${p=>p.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)'};
  background:${p=>p.theme.colors.surface};
  overflow-y:auto;
  scrollbar-width:thin;scrollbar-color:rgba(155,93,229,.15) transparent;
`;

export const SidebarSection = styled.div`padding:16px 0 8px;`;

export const SidebarLabel = styled.div`
  padding:0 16px 8px;
  font-size:9.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:${p=>p.theme.colors.muted};opacity:.55;
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
    content:'';position:absolute;left:0;top:5px;bottom:5px;width:3px;
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
  width:32px;height:32px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:15px;border-radius:8px;
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
  padding:8px 16px 6px;
  font-size:9.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:${p=>p.theme.colors.muted};opacity:.55;
`;

export const SceneTile = styled.button<{$active:boolean}>`
  width:100%;display:flex;align-items:center;gap:9px;
  padding:8px 16px;border:none;cursor:pointer;
  font-family:inherit;text-align:left;position:relative;
  background:${p=>p.$active?'rgba(245,158,11,.07)':'transparent'};
  transition:background .15s;
  &::before{
    content:'';position:absolute;left:0;top:4px;bottom:4px;width:3px;
    border-radius:0 3px 3px 0;background:#f59e0b;
    opacity:${p=>p.$active?1:0};transition:opacity .15s;
  }
  &:hover{background:rgba(245,158,11,.04);}
`;

export const SceneTileNum = styled.div<{$active:boolean}>`
  width:24px;height:24px;border-radius:7px;flex-shrink:0;
  background:${p=>p.$active
    ?'linear-gradient(135deg,#f59e0b,#d97706)'
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

export const DurationChip = styled.div`
  font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:4px;
  background:rgba(245,158,11,.1);color:#d97706;
  border:1px solid rgba(245,158,11,.15);
  margin-top:3px;display:inline-block;
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
  border:1.5px solid ${p=>p.theme.mode==='dark'?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)'};
  border-radius:14px;padding:14px 16px;
  box-shadow:${p=>p.theme.shadows.sm};
  transition:border-color .2s,box-shadow .2s;
  &:focus-within{
    border-color:${p=>p.$color?`${p.$color}55`:'rgba(155,93,229,.35)'};
    box-shadow:0 0 0 3px ${p=>p.$color?`${p.$color}14`:'rgba(155,93,229,.08)'};
  }
`;

export const FieldLabel = styled.div`
  font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;
  color:${p=>p.theme.colors.muted};margin-bottom:8px;
`;

export const CharCountRow = styled.div`
  display:flex;justify-content:flex-end;margin-top:6px;
`;

export const CharCount = styled.span<{$warn?:boolean}>`
  font-size:10px;font-weight:600;
  color:${p=>p.$warn?'#f59e0b':p.theme.colors.muted};
  opacity:${p=>p.$warn?.8:.45};
  transition:color .2s,opacity .2s;
`;

export const ContentTextarea = styled.textarea`
  width:100%;min-height:100px;max-height:300px;resize:vertical;
  background:transparent;border:none;outline:none;padding:0;
  font-size:13.5px;line-height:1.7;
  color:${p=>p.theme.colors.text};font-family:inherit;
  caret-color:${p=>p.theme.colors.primary};
  box-sizing:border-box;
  scrollbar-width:thin;scrollbar-color:rgba(155,93,229,.15) transparent;
  &::placeholder{color:${p=>p.theme.colors.muted};opacity:.4;}
`;

export const VoiceSection = styled.div`display:flex;flex-direction:column;gap:16px;`;

export const VoiceInput = styled.input`
  width:100%;background:transparent;border:none;outline:none;padding:0;
  color:${p=>p.theme.colors.text};font-size:13.5px;font-family:inherit;
  caret-color:${p=>p.theme.colors.primary};
  &::placeholder{color:${p=>p.theme.colors.muted};opacity:.4;}
`;

export const GenderToggle = styled.div`display:flex;gap:8px;flex-wrap:wrap;`;

export const GenderBtn = styled.button<{$active:boolean}>`
  padding:9px 22px;border-radius:10px;
  border:1.5px solid ${p=>p.$active?'rgba(236,72,153,.35)':(p.theme.mode==='dark'?'rgba(255,255,255,.1)':'rgba(0,0,0,.1)')};
  background:${p=>p.$active?'rgba(236,72,153,.08)':'transparent'};
  color:${p=>p.$active?'#ec4899':p.theme.colors.muted};
  font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;
  transition:all .18s;
  &:hover{border-color:rgba(236,72,153,.3);background:rgba(236,72,153,.05);}
`;

// ─── Scene panel ──────────────────────────────────────────────────────────────
export const SceneTabs = styled.div`
  display:flex;gap:6px;margin-bottom:24px;flex-wrap:wrap;
`;

export const SceneTab = styled.button<{$active:boolean}>`
  padding:6px 15px;border-radius:9px;
  border:1.5px solid ${p=>p.$active?'rgba(245,158,11,.4)':(p.theme.mode==='dark'?'rgba(255,255,255,.1)':'rgba(0,0,0,.1)')};
  background:${p=>p.$active?'rgba(245,158,11,.1)':'transparent'};
  color:${p=>p.$active?'#d97706':p.theme.colors.muted};
  font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;
  transition:all .15s;
  &:hover{border-color:rgba(245,158,11,.3);background:rgba(245,158,11,.06);}
`;

export const SceneFieldGroup = styled.div`display:flex;flex-direction:column;gap:16px;`;

export const DurationRow = styled.div`display:flex;align-items:center;gap:10px;`;

export const DurationInput = styled.input`
  width:80px;padding:0;
  background:transparent;border:none;outline:none;text-align:center;
  color:${p=>p.theme.colors.text};
  font-size:28px;font-weight:800;font-family:inherit;
  caret-color:${p=>p.theme.colors.primary};
  /* Hide number spinners */
  &::-webkit-inner-spin-button,&::-webkit-outer-spin-button{-webkit-appearance:none;}
  -moz-appearance:textfield;
`;

export const DurationUnit = styled.span`
  font-size:13px;font-weight:600;color:${p=>p.theme.colors.muted};
`;

// ─── Bottom bar ───────────────────────────────────────────────────────────────
export const BottomBar = styled.div`
  height:70px;flex-shrink:0;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;gap:12px;
  border-top:1px solid ${p=>p.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)'};
  background:${p=>p.theme.colors.surface};
  box-shadow:0 -1px 6px ${p=>p.theme.mode==='dark'?'rgba(0,0,0,.25)':'rgba(0,0,0,.05)'};
`;

export const BottomLeft = styled.div`flex:1;min-width:0;`;

export const StatusText = styled.div`
  font-size:12px;color:${p=>p.theme.colors.primary};
  font-weight:600;white-space:nowrap;opacity:.7;
`;

export const GenerateBtn = styled.button<{$loading:boolean;$hasChanges:boolean}>`
  display:inline-flex;align-items:center;gap:8px;
  padding:13px 30px;border-radius:12px;border:none;cursor:pointer;
  font-size:13.5px;font-weight:700;font-family:inherit;flex-shrink:0;
  background:${p=>p.$hasChanges
    ?'linear-gradient(135deg,#f59e0b,#d97706)'
    :'linear-gradient(135deg,#9b5de5,#14b8a6)'};
  color:white;
  box-shadow:${p=>p.$hasChanges
    ?'0 4px 18px rgba(245,158,11,.35)'
    :'0 4px 20px rgba(155,93,229,.35)'};
  transition:all .22s cubic-bezier(.4,0,.2,1);
  opacity:${p=>p.$loading?.7:1};
  &:hover:not(:disabled){
    transform:translateY(-2px);
    box-shadow:${p=>p.$hasChanges
      ?'0 7px 24px rgba(245,158,11,.48)'
      :'0 7px 26px rgba(155,93,229,.5)'};
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
