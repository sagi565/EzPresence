import styled, { keyframes } from 'styled-components';

const fadeIn  = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translate(-50%,-44%) scale(.96)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}`;

export const Overlay = styled.div`
  position:fixed;inset:0;z-index:4000;
  background:rgba(0,0,0,.55);
  backdrop-filter:blur(6px);
  animation:${fadeIn} .18s ease both;
`;

export const Dialog = styled.div`
  position:fixed;top:50%;left:50%;z-index:4001;
  transform:translate(-50%,-50%);
  width:min(400px,90vw);
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.22);
  border-radius:20px;
  padding:28px 28px 24px;
  box-shadow:0 24px 60px rgba(0,0,0,.4),0 0 0 1px rgba(139,92,246,.08);
  animation:${slideUp} .22s cubic-bezier(.34,1.1,.64,1) both;
  text-align:center;
`;

export const IconWrap = styled.div<{$danger?:boolean}>`
  width:48px;height:48px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 16px;
  background:${p=>p.$danger?'rgba(239,68,68,.1)':'rgba(139,92,246,.1)'};
  color:${p=>p.$danger?'#ef4444':'#9b5de5'};
`;

export const Title = styled.div`
  font-size:16px;font-weight:700;
  color:${p=>p.theme.colors.text};
  margin-bottom:8px;letter-spacing:-.01em;
`;

export const Message = styled.div`
  font-size:13px;line-height:1.6;
  color:${p=>p.theme.colors.muted};
  margin-bottom:24px;
`;

export const Buttons = styled.div`
  display:flex;gap:10px;
`;

export const Btn = styled.button<{$primary?:boolean;$danger?:boolean}>`
  flex:1;padding:11px 16px;border-radius:12px;border:none;
  font-size:13px;font-weight:700;font-family:inherit;
  cursor:pointer;transition:all .18s;letter-spacing:.01em;
  ${p=>p.$danger?`
    background:rgba(239,68,68,.12);color:#ef4444;
    &:hover{background:rgba(239,68,68,.2);}
  `:p.$primary?`
    background:linear-gradient(135deg,#9b5de5 0%,#7c3aed 100%);color:#fff;
    box-shadow:0 4px 16px rgba(139,92,246,.35);
    &:hover{box-shadow:0 6px 20px rgba(139,92,246,.5);transform:translateY(-1px);}
  `:`
    background:rgba(139,92,246,.07);color:${p.theme.colors.muted};
    border:1.5px solid rgba(139,92,246,.12);
    &:hover{background:rgba(139,92,246,.12);border-color:rgba(139,92,246,.25);}
  `}
`;
