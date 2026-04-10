import styled, { keyframes, css } from 'styled-components';
import { fadeIn, fadeOut } from '@pages/Studio/VisionPage/styles';

const pulseDot  = keyframes`0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.6);opacity:1}`;
const shimmer   = keyframes`
  0%   { background-position: 0% center; }
  50%  { background-position: 100% center; }
  100% { background-position: 0% center; }
`;

export const PlanningOverlay = styled.div<{$leaving:boolean}>`
  flex:1;width:100%;height:calc(100vh - 76px);
  display:flex;flex-direction:column;align-items:center;justify-content:flex-start;
  padding-top:7vh;
  gap:40px;position:relative;overflow:hidden;
  animation:${p=>p.$leaving?css`${fadeOut} .5s cubic-bezier(.4,0,.2,1) forwards`:css`${fadeIn} .4s ease both`};
`;

export const PlanningInner = styled.div`
  display:flex;flex-direction:column;align-items:center;gap:20px;position:relative;z-index:1;
`;

export const PlanningTitle = styled.div`
  font-size:clamp(2rem,3.5vw,2.8rem);font-weight:800;letter-spacing:-.5px;
  background:linear-gradient(90deg,#7c3aed 0%,#a78bfa 25%,#c084fc 50%,#a78bfa 75%,#7c3aed 100%);
  background-size:300% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:${shimmer} 5s cubic-bezier(0.45,0,0.55,1) infinite;
`;

export const PlanningTextWrap = styled.div`
  position:relative;height:32px;overflow:hidden;width:100%;text-align:center;
`;

export const PlanningTextLine = styled.div<{$visible:boolean}>`
  width:100%;font-size:17px;font-weight:500;text-align:center;
  color:${p=>p.theme.colors.muted};letter-spacing:.01em;
  opacity:${p=>p.$visible ? 1 : 0};
  transform:translateY(${p=>p.$visible ? 0 : -8}px);
  transition:opacity 0.4s ease, transform 0.4s ease;
`;

export const PlanningDots = styled.div`display:flex;gap:8px;align-items:center;`;

export const PlanningDot = styled.div<{$delay:string}>`
  width:5px;height:5px;border-radius:50%;background:#8b5cf6;
  animation:${pulseDot} 2.8s ease-in-out ${p=>p.$delay} infinite;
`;

export const PlanningFooter = styled.div`
  display:flex;flex-direction:column;align-items:center;gap:10px;
  width:100%;max-width:300px;position:relative;z-index:1;
`;

export const ProgressBarWrap = styled.div`
  width:100%;max-width:280px;height:3px;background:rgba(139,92,246,.1);border-radius:999px;overflow:hidden;
`;

export const ProgressBarFill = styled.div`
  height:100%;background:linear-gradient(90deg,#a78bfa,#7c3aed);border-radius:999px;
  animation:${css`@keyframes prog{0%{width:0%}85%{width:82%}100%{width:88%}}prog 18s cubic-bezier(.4,0,.2,1) forwards`};
`;

export const ElapsedLabel = styled.span`
  font-size:14px;color:rgba(139,92,246,.75);font-weight:700;letter-spacing:.02em;
`;
