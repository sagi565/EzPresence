import styled, { keyframes } from 'styled-components';

export const orbit = keyframes`from{transform:rotate(0deg) translateX(var(--r)) rotate(0deg)}to{transform:rotate(360deg) translateX(var(--r)) rotate(-360deg)}`;
export const planPulse = keyframes`0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}`;
export const planRing = keyframes`0%{transform:scale(.6);opacity:.8}100%{transform:scale(2.2);opacity:0}`;
export const planSpin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

export const PlanningOrbitRing = styled.div<{$size:number;$dur:string;$delay:string;$op:number}>`
  position:absolute;top:50%;left:50%;
  width:${p=>p.$size}px;height:${p=>p.$size}px;border-radius:50%;
  border:1px solid rgba(139,92,246,${p=>p.$op});margin:-${p=>p.$size/2}px;
  animation:${planSpin} ${p=>p.$dur} linear ${p=>p.$delay} infinite;
`;
export const PlanningOrbitDot = styled.div<{$r:number;$dur:string;$delay:string}>`
  --r:${p=>p.$r}px;position:absolute;top:50%;left:50%;
  width:6px;height:6px;margin:-3px;border-radius:50%;
  background:rgba(167,139,250,.9);box-shadow:0 0 10px rgba(139,92,246,.8);
  animation:${orbit} ${p=>p.$dur} linear ${p=>p.$delay} infinite;
`;
export const PlanningGlow = styled.div`position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 65%);pointer-events:none;animation:${planPulse} 3s ease-in-out infinite;`;
export const PlanningRing = styled.div<{$size:number;$delay:string}>`position:absolute;top:50%;left:50%;width:${p=>p.$size}px;height:${p=>p.$size}px;border-radius:50%;border:1px solid rgba(139,92,246,.3);margin:-${p=>p.$size/2}px;animation:${planRing} 2.4s ease-out ${p=>p.$delay} infinite;`;
