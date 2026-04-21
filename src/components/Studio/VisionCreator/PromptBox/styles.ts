import styled, { keyframes, css } from 'styled-components';

export const blink     = keyframes`0%,100%{opacity:1}50%{opacity:0}`;
export const spin      = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
export const rippleA   = keyframes`0%{transform:scale(0);opacity:.6}100%{transform:scale(2.8);opacity:0}`;
/* subtle wiggle — hints the user that duration can be changed when trim hits the limit */
export const durationTwitch = keyframes`
  0%   { transform: translateX(0);     }
  18%  { transform: translateX(-1.5px);}
  34%  { transform: translateX(1.5px); }
  50%  { transform: translateX(-1px);  }
  66%  { transform: translateX(1px);   }
  82%  { transform: translateX(-.5px); }
  100% { transform: translateX(0);     }
`;

export const StyledPromptBox = styled.div<{$drag:boolean;$focus:boolean}>`
  width:100%;background:${p=>p.theme.colors.surface};border-radius:20px;
  border:1.5px solid ${p=>p.$drag?'rgba(139,92,246,.8)':p.$focus?'rgba(139,92,246,.38)':'rgba(139,92,246,.1)'};
  position:relative;z-index:2;transition:border-color .35s ease,box-shadow .35s ease;
  box-shadow:${p=>p.$drag?'0 0 0 4px rgba(139,92,246,.12),0 8px 32px rgba(139,92,246,.14)':p.$focus?'0 0 0 3px rgba(139,92,246,.08),0 6px 24px rgba(139,92,246,.10)':'0 0 0 0px rgba(139,92,246,0)'};
  &:hover{box-shadow:0 0 0 3px rgba(139,92,246,.06),0 4px 16px rgba(139,92,246,.08);}
`;
export const DragOverlay = styled.div<{$v:boolean}>`position:absolute;inset:0;z-index:10;border-radius:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:rgba(139,92,246,.05);backdrop-filter:blur(1px);border:1px solid rgba(139,92,246,.2);opacity:${p=>p.$v?1:0};pointer-events:none;transition:opacity .2s;`;
export const TextareaWrap = styled.div<{$minimalist?:boolean}>`padding:${p=>p.$minimalist?'10px 16px 0':'18px 18px 0'};position:relative;`;
export const Placeholder = styled.div<{$v:boolean}>`position:absolute;top:18px;left:18px;right:18px;pointer-events:none;font-size:15px;line-height:1.6;color:${p=>p.theme.colors.muted};opacity:${p=>p.$v?1:0};transition:opacity .15s;`;
export const TwText = styled.span`color:${p=>p.theme.colors.muted};`;
export const Cursor = styled.span`display:inline-block;width:2px;height:1em;background:#8b5cf6;margin-left:2px;vertical-align:text-bottom;border-radius:1px;animation:${blink} 1s step-end infinite;`;
export const Textarea = styled.textarea<{$minimalist?:boolean}>`width:100%;min-height:${p=>p.$minimalist?'36px':'76px'};max-height:${p=>p.$minimalist?'90px':'200px'};background:transparent;border:none;outline:none;resize:none;font-size:${p=>p.$minimalist?'14px':'15px'};line-height:1.6;color:${p=>p.theme.colors.text};font-family:inherit;box-sizing:border-box;padding:0;caret-color:#8b5cf6;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(139,92,246,.15) transparent;&::placeholder{color:transparent;}`;
export const AttachList = styled.div`display:flex;flex-wrap:wrap;gap:6px;padding:10px 18px 0;`;
export const AttachChip = styled.div`display:inline-flex;align-items:center;gap:5px;padding:4px 9px 4px 7px;background:rgba(139,92,246,.07);border:1px solid rgba(139,92,246,.16);border-radius:7px;font-size:11.5px;color:#8b5cf6;font-weight:500;max-width:200px;`;
export const AttachName = styled.span`overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
export const RemoveBtn = styled.button`background:none;border:none;cursor:pointer;padding:0;color:${p=>p.theme.colors.muted};font-size:16px;line-height:1;display:flex;align-items:center;flex-shrink:0;opacity:.5;&:hover{opacity:1;color:#8b5cf6;}`;
export const Toolbar   = styled.div<{$minimalist?:boolean}>`display:flex;align-items:center;padding:${p=>p.$minimalist?'7px 12px':'10px 13px'};gap:6px;border-top:1px solid ${p=>p.theme.colors.primaryLight};margin-top:${p=>p.$minimalist?'6px':'10px'};@media(max-width:480px){padding:8px 10px;gap:4px;}`;
export const IconBtn   = styled.button<{$active?:boolean}>`display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9px;flex-shrink:0;border:1.5px solid ${p=>p.$active?'rgba(139,92,246,.4)':'rgba(139,92,246,.1)'};background:${p=>p.$active?'rgba(139,92,246,.1)':'transparent'};color:${p=>p.$active?'#8b5cf6':p.theme.colors.muted};cursor:pointer;transition:all .18s;&:hover{background:rgba(139,92,246,.08);border-color:rgba(139,92,246,.3);color:#8b5cf6;}&.twitch{animation:${durationTwitch} .5s cubic-bezier(.36,.07,.19,.97) both;border-color:rgba(139,92,246,.55);background:rgba(139,92,246,.14);color:#8b5cf6;}@media(max-width:480px){width:29px;height:29px;border-radius:8px;}`;
export const Spacer    = styled.div`flex:1;`;
export const CharCount = styled.span<{$w:boolean}>`font-size:11.5px;color:${p=>p.$w?'#f59e0b':p.theme.colors.muted};opacity:.65;font-variant-numeric:tabular-nums;`;
export const QuickBtn  = styled.button<{$ready:boolean;$loading:boolean}>`display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 16px;border-radius:12px;font-size:13.5px;font-weight:600;font-family:inherit;border:1.5px solid rgba(139,92,246,.3);background:transparent;color:rgba(139,92,246,.7);cursor:${p=>(p.$ready&&!p.$loading)?'pointer':'default'};transition:all .2s;opacity:${p=>(!p.$ready||p.$loading)?0.4:1};${p=>p.$ready&&!p.$loading&&css`&:hover{background:rgba(139,92,246,.08);border-color:rgba(139,92,246,.5);color:#8b5cf6;}`}@media(max-width:480px){padding:7px 12px;font-size:12.5px;border-radius:10px;}`;
export const SendBtn   = styled.button<{$ready:boolean;$loading:boolean}>`position:relative;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 20px;border-radius:12px;border:none;cursor:${p=>(p.$ready&&!p.$loading)?'pointer':'default'};font-size:13.5px;font-weight:700;font-family:inherit;background:${p=>p.$ready?'linear-gradient(135deg,#a78bfa,#7c3aed)':'rgba(139,92,246,.08)'};color:${p=>p.$ready?'white':'rgba(139,92,246,.35)'};transition:all .25s cubic-bezier(.4,0,.2,1);overflow:hidden;${p=>p.$ready&&!p.$loading&&css`box-shadow:0 4px 18px rgba(124,58,237,.35);&:hover{transform:translateY(-2px);box-shadow:0 7px 24px rgba(124,58,237,.48);}&:active{transform:translateY(0);}`}@media(max-width:480px){padding:7px 12px;font-size:12.5px;border-radius:10px;}`;
export const Spinner   = styled.div`width:13px;height:13px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:${spin} .65s linear infinite;`;
export const RippleEl  = styled.span`position:absolute;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.4);animation:${rippleA} .55s ease-out forwards;`;

/* ── Duration dropdown ── */
export const DurationWrap = styled.div`position:relative;display:inline-flex;`;
export const DurationBadge = styled.span`
  position:absolute;
  bottom:3px;left:50%;transform:translateX(-50%);
  font-size:8px;font-weight:800;line-height:1;
  font-variant-numeric:tabular-nums;letter-spacing:.02em;
  color:currentColor;
  pointer-events:none;
  opacity:.9;
  min-width:14px;text-align:center;
`;
export const DurationDropdown = styled.div<{$open:boolean}>`
  display:${p=>p.$open?'flex':'none'};
  flex-direction:column;gap:2px;
  position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);
  min-width:170px;
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.18);
  border-radius:12px;padding:6px;
  box-shadow:0 8px 28px rgba(0,0,0,.18);z-index:50;
`;
export const DurationOption = styled.button<{$active:boolean}>`
  display:flex;align-items:center;justify-content:space-between;
  width:100%;padding:7px 10px;border-radius:8px;font-family:inherit;
  border:none;cursor:pointer;transition:background .15s;
  background:${p=>p.$active?'rgba(139,92,246,.1)':'transparent'};
  &:hover{background:rgba(139,92,246,.08);}
`;
export const DurOptLabel = styled.span<{$active:boolean}>`
  font-size:12.5px;font-weight:${p=>p.$active?700:500};
  color:${p=>p.$active?'#8b5cf6':p.theme.colors.text};
`;
export const DurOptRange = styled.span`
  font-size:11px;color:${p=>p.theme.colors.muted};opacity:.6;
  font-variant-numeric:tabular-nums;
`;

export const ToolbarDivider = styled.div`
  width:1px;height:18px;
  background:rgba(139,92,246,.12);
  flex-shrink:0;align-self:center;
`;

export const AutoIconBtn = styled.button<{$active:boolean}>`
  display:inline-flex;align-items:center;justify-content:center;
  width:34px;height:34px;border-radius:9px;flex-shrink:0;
  border:1.5px solid ${p=>p.$active?'rgba(251,191,36,.5)':'rgba(139,92,246,.1)'};
  background:${p=>p.$active?'rgba(251,191,36,.1)':'transparent'};
  color:${p=>p.$active?'#fbbf24':p.theme.colors.muted};
  cursor:pointer;transition:all .18s;
  &:hover{background:rgba(251,191,36,.08);border-color:rgba(251,191,36,.4);color:#fbbf24;}
  @media(max-width:480px){width:29px;height:29px;border-radius:8px;}
`;

/* ── Auto toggle button ── */
export const AutoBtn = styled.button<{$active:boolean;$loading:boolean}>`
  display:inline-flex;align-items:center;gap:4px;
  height:26px;padding:0 8px 0 7px;border-radius:7px;flex-shrink:0;
  border:1.5px solid ${p=>p.$active?'rgba(251,191,36,.5)':'rgba(251,191,36,.18)'};
  background:${p=>p.$active?'rgba(251,191,36,.1)':'transparent'};
  color:${p=>p.$active?'#fbbf24':p.theme.colors.muted};
  cursor:${p=>p.$loading?'default':'pointer'};
  font-family:inherit;font-size:11px;font-weight:600;
  transition:all .18s;
  &:hover{background:rgba(251,191,36,.05);border-color:rgba(251,191,36,.28);color:${p=>p.theme.colors.text};}
  @media(max-width:480px){height:24px;padding:0 6px 0 5px;border-radius:6px;}
`;

export const TooltipWrap = styled.div`
  position: relative;
  &::after {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 7px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(17,24,39,.82);
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 9px;
    border-radius: 7px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity .15s;
    z-index: 50;
  }
  &:hover::after { opacity: 1; }
`;
