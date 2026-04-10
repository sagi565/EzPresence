import styled, { keyframes } from 'styled-components';

// ─── Animations ────────────────────────────────────────────────────────────────
export const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;
export const pulse = keyframes`0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}`;
export const slideInScene = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;
export const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

// ─── Layout ────────────────────────────────────────────────────────────────────
export const Wrap = styled.div`
  width:100%;max-width:760px;
  display:flex;flex-direction:column;gap:16px;
  animation:${fadeUp} .55s cubic-bezier(.4,0,.2,1) both;
`;

// ─── Header card ───────────────────────────────────────────────────────────────
export const HeaderCard = styled.div`
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.14);
  border-radius:20px;padding:24px 26px 20px;
  display:flex;flex-direction:column;gap:12px;
`;
export const TopRow = styled.div`display:flex;align-items:flex-start;justify-content:space-between;gap:12px;`;
export const Badges = styled.div`display:flex;align-items:center;gap:8px;flex-wrap:wrap;`;
export const ReadyDot = styled.div`
  width:7px;height:7px;border-radius:50%;background:#22c55e;
  box-shadow:0 0 8px #22c55e;animation:${pulse} 1.6s ease-in-out infinite;
`;
export const ReadyBadge = styled.div`
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 11px;border-radius:999px;
  background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.18);
  font-size:11px;font-weight:700;color:#16a34a;letter-spacing:.06em;text-transform:uppercase;
`;
export const VersionBadge = styled.div`
  padding:4px 11px;border-radius:999px;
  background:rgba(139,92,246,.07);border:1px solid rgba(139,92,246,.15);
  font-size:11px;font-weight:700;color:rgba(139,92,246,.6);letter-spacing:.05em;
`;
export const ChangedDot = styled.div`
  width:7px;height:7px;border-radius:50%;background:#f59e0b;
  box-shadow:0 0 7px #f59e0b;animation:${pulse} 1.2s ease-in-out infinite;
`;
export const TitleInput = styled.input`
  width:100%;background:transparent;border:none;outline:none;
  font-size:clamp(1.1rem,2.2vw,1.45rem);font-weight:700;letter-spacing:-.4px;
  color:${p=>p.theme.colors.text};font-family:inherit;padding:0;
  caret-color:#8b5cf6;
  &::placeholder{color:${p=>p.theme.colors.muted};opacity:.35;}
  &:focus{border-bottom:2px solid rgba(139,92,246,.25);}
  transition:border-bottom .15s;
`;
export const MetaRow = styled.div`display:flex;gap:8px;flex-wrap:wrap;`;
export const EditPill = styled.div<{$active?:boolean}>`
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 12px;border-radius:8px;cursor:pointer;
  border:1.5px solid ${p=>p.$active?'rgba(139,92,246,.4)':'rgba(139,92,246,.1)'};
  background:${p=>p.$active?'rgba(139,92,246,.1)':'transparent'};
  font-size:12px;font-weight:700;color:${p=>p.theme.colors.muted};
  transition:all .18s;
  &:hover{border-color:rgba(139,92,246,.35);background:rgba(139,92,246,.07);}
`;
export const PillLabel = styled.span`opacity:.55;font-size:10px;margin-right:2px;`;

// ─── Section card ───────────────────────────────────────────────────────────────
export const SectionCard = styled.div<{$delay?:string}>`
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.1);
  border-radius:16px;overflow:hidden;
  animation:${fadeUp} .55s cubic-bezier(.4,0,.2,1) ${p=>p.$delay||'0s'} both;
`;
export const SectionHeader = styled.div`
  display:flex;align-items:center;gap:10px;
  padding:14px 18px;
  border-bottom:1px solid rgba(139,92,246,.07);
`;
export const SectionIcon = styled.div`
  width:32px;height:32px;border-radius:9px;flex-shrink:0;
  background:linear-gradient(135deg,rgba(167,139,250,.15),rgba(109,40,217,.1));
  border:1px solid rgba(139,92,246,.15);
  display:flex;align-items:center;justify-content:center;font-size:15px;
`;
export const SectionTitle = styled.div`
  font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  color:${p=>p.theme.colors.muted};
`;
export const SectionBody = styled.div`padding:14px 18px 16px;`;
export const EditArea = styled.textarea`
  width:100%;min-height:80px;background:rgba(139,92,246,.03);
  border:1.5px solid rgba(139,92,246,.09);border-radius:10px;
  outline:none;resize:vertical;padding:12px 14px;
  font-size:13px;line-height:1.65;color:${p=>p.theme.colors.text};
  font-family:inherit;box-sizing:border-box;caret-color:#8b5cf6;
  transition:border-color .18s,box-shadow .18s;
  &:focus{border-color:rgba(139,92,246,.35);box-shadow:0 0 0 3px rgba(139,92,246,.06);}
  scrollbar-width:thin;scrollbar-color:rgba(139,92,246,.15) transparent;
`;
export const EditInput = styled.input`
  width:100%;background:rgba(139,92,246,.03);
  border:1.5px solid rgba(139,92,246,.09);border-radius:10px;
  outline:none;padding:10px 14px;
  font-size:13px;color:${p=>p.theme.colors.text};
  font-family:inherit;box-sizing:border-box;caret-color:#8b5cf6;
  transition:border-color .18s;
  &:focus{border-color:rgba(139,92,246,.35);}
`;
export const VoiceRow = styled.div`display:flex;gap:10px;align-items:flex-end;`;
export const GenderToggle = styled.div`display:flex;gap:6px;`;
export const GenderBtn = styled.button<{$active:boolean}>`
  padding:9px 16px;border-radius:8px;border:1.5px solid;
  font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;
  transition:all .18s;
  border-color:${p=>p.$active?'rgba(139,92,246,.45)':'rgba(139,92,246,.1)'};
  background:${p=>p.$active?'rgba(139,92,246,.12)':'transparent'};
  color:${p=>p.$active?'#a78bfa':p.theme.colors.muted};
  &:hover{border-color:rgba(139,92,246,.3);background:rgba(139,92,246,.07);}
`;

// ─── Scenes ────────────────────────────────────────────────────────────────────
export const ScenesHeader = styled.div`
  padding:14px 18px;border-bottom:1px solid rgba(139,92,246,.07);
  display:flex;align-items:center;justify-content:space-between;
`;
export const SceneCount = styled.div`
  font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  color:rgba(139,92,246,.6);background:rgba(139,92,246,.07);
  padding:3px 10px;border-radius:6px;
`;
export const SceneItem = styled.div<{$open:boolean;$i:number}>`
  border-bottom:1px solid rgba(139,92,246,.06);
  animation:${slideInScene} .4s cubic-bezier(.4,0,.2,1) ${p=>p.$i*0.06}s both;
  &:last-child{border-bottom:none;}
`;
export const SceneToggle = styled.button<{$open:boolean}>`
  width:100%;display:flex;align-items:center;gap:12px;
  padding:13px 18px;background:none;border:none;cursor:pointer;text-align:left;
  transition:background .15s;
  &:hover{background:rgba(139,92,246,.04);}
`;
export const SceneNum = styled.div`
  width:26px;height:26px;border-radius:8px;flex-shrink:0;
  background:linear-gradient(135deg,#a78bfa,#7c3aed);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:800;color:white;
`;
export const SceneToggleTitle = styled.div`
  flex:1;font-size:13px;font-weight:600;color:${p=>p.theme.colors.text};
  text-align:left;line-height:1.4;
`;
export const Chevron = styled.div<{$open:boolean}>`
  color:rgba(139,92,246,.4);font-size:14px;
  transform:${p=>p.$open?'rotate(180deg)':'rotate(0deg)'};
  transition:transform .22s;flex-shrink:0;
`;
export const SceneBody = styled.div<{$open:boolean}>`
  max-height:${p=>p.$open?'1200px':'0'};
  overflow:hidden;
  transition:max-height .35s cubic-bezier(.4,0,.2,1);
`;
export const SceneFields = styled.div`padding:4px 18px 18px;display:flex;flex-direction:column;gap:12px;`;
export const FieldLabel = styled.div`
  font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  color:rgba(139,92,246,.55);margin-bottom:5px;
`;
export const DurationRow = styled.div`display:flex;align-items:center;gap:10px;`;
export const DurationInput = styled.input`
  width:80px;padding:8px 12px;border-radius:8px;
  border:1.5px solid rgba(139,92,246,.12);background:rgba(139,92,246,.04);
  color:${p=>p.theme.colors.text};font-size:13px;font-weight:700;
  font-family:inherit;outline:none;text-align:center;
  &:focus{border-color:rgba(139,92,246,.35);}
`;
export const DurationUnit = styled.span`font-size:12px;color:${p=>p.theme.colors.muted};`;

// ─── Actions ───────────────────────────────────────────────────────────────────
export const ActionsRow = styled.div`
  display:flex;align-items:center;gap:10px;
  padding:14px 18px;border-top:1px solid rgba(139,92,246,.08);
  background:rgba(139,92,246,.02);
`;

export const Spacer = styled.div`flex:1;`;
export const StatusText = styled.div`font-size:12px;color:rgba(139,92,246,.55);font-weight:600;`;
export const GenerateBtn = styled.button<{$loading:boolean;$hasChanges:boolean}>`
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 24px;border-radius:14px;border:none;cursor:pointer;
  font-size:13px;font-weight:700;font-family:inherit;letter-spacing:.02em;
  background:${p=>p.$hasChanges
    ?'linear-gradient(135deg,#f59e0b,#e07b00)'
    :'linear-gradient(135deg,#9b5de5,#7c3aed)'};
  color:white;transition:all .22s cubic-bezier(.4,0,.2,1);
  box-shadow:${p=>p.$hasChanges
    ?'0 3px 14px rgba(245,158,11,.3),inset 0 1px 0 rgba(255,255,255,.15)'
    :'0 3px 14px rgba(124,58,237,.3),inset 0 1px 0 rgba(255,255,255,.12)'};
  opacity:${p=>p.$loading?.65:1};
  &:hover:not(:disabled){
    transform:translateY(-1px);
    box-shadow:${p=>p.$hasChanges
      ?'0 6px 20px rgba(245,158,11,.42),inset 0 1px 0 rgba(255,255,255,.15)'
      :'0 6px 20px rgba(124,58,237,.42),inset 0 1px 0 rgba(255,255,255,.12)'};}
  &:active{transform:translateY(0);}
  &:disabled{cursor:default;}
`;
export const BtnSpinner = styled.div`
  width:13px;height:13px;border:2px solid rgba(255,255,255,.3);
  border-top-color:white;border-radius:50%;animation:${spin} .65s linear infinite;
`;
