import styled, { keyframes } from 'styled-components';

export const shimmer = keyframes`
  0%   { background-position: 0% center; }
  50%  { background-position: 100% center; }
  100% { background-position: 0% center; }
`;

export const Header = styled.div`display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:8px;width:100%;position:relative;z-index:2;`;
export const CreatorBadge = styled.div`
  display:inline-flex;align-items:center;gap:8px;padding:5px 16px 5px 7px;
  background:${p=>p.theme.colors.surface};border:1px solid rgba(139,92,246,.18);
  border-radius:999px;font-size:11px;font-weight:700;color:${p=>p.theme.colors.muted};
  letter-spacing:.08em;text-transform:uppercase;
`;
export const BadgeDot = styled.span`width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#6d28d9);display:flex;align-items:center;justify-content:center;font-size:9px;`;
export const PageTitle = styled.h1`font-size:clamp(2rem,4vw,3.2rem);font-weight:800;letter-spacing:-2px;line-height:1.05;margin:0;color:${p=>p.theme.colors.text};text-align:center;`;
export const TitleAccent = styled.span`
  background:linear-gradient(90deg,#7c3aed 0%,#a78bfa 25%,#c084fc 50%,#a78bfa 75%,#7c3aed 100%);
  background-size:300% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:${shimmer} 5s cubic-bezier(0.45,0,0.55,1) infinite;
`;
export const PageSubtitle = styled.p`font-size:14px;color:${p=>p.theme.colors.muted};margin:0;line-height:1.6;max-width:440px;text-align:center;`;
