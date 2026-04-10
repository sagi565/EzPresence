import styled, { keyframes } from 'styled-components';

export const drift = keyframes`0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(28px,-18px) scale(1.04)}66%{transform:translate(-18px,8px) scale(.97)}`;
export const pulseDot = keyframes`0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.6);opacity:1}`;
export const orbit = keyframes`from{transform:rotate(0deg) translateX(var(--r)) rotate(0deg)}to{transform:rotate(360deg) translateX(var(--r)) rotate(-360deg)}`;

export const BgOrb = styled.div<{$s:number;$x:string;$y:string;$c:string;$op:number;$delay?:string}>`
  position:fixed;width:${p=>p.$s}px;height:${p=>p.$s}px;
  left:${p=>p.$x};top:${p=>p.$y};
  background:radial-gradient(circle,${p=>p.$c} 0%,transparent 65%);
  opacity:${p=>p.$op};border-radius:50%;pointer-events:none;filter:blur(52px);
  animation:${drift} 20s ease-in-out ${p=>p.$delay||'0s'} infinite;
`;
export const OrbitsWrap = styled.div`position:absolute;top:40%;left:50%;pointer-events:none;z-index:-1;`;
export const OrbitRing = styled.div<{$size:number}>`
  position:absolute;width:${p=>p.$size}px;height:${p=>p.$size}px;
  border-radius:50%;border:1.5px dashed rgba(139,92,246,.1);
  top:50%;left:50%;transform:translate(-50%,-50%);
`;
export const OrbitDot = styled.div<{$r:number;$dur:string;$delay:string;$size:number}>`
  --r:${p=>p.$r}px;position:absolute;top:50%;left:50%;
  width:${p=>p.$size}px;height:${p=>p.$size}px;margin:-${p=>p.$size/2}px;
  border-radius:50%;background:rgba(139,92,246,.7);box-shadow:0 0 12px rgba(139,92,246,.6);
  animation:${orbit} ${p=>p.$dur} linear ${p=>p.$delay} infinite;
`;
export const FloatDot = styled.div<{$x:string;$y:string;$size:number;$delay:string}>`
  position:fixed;left:${p=>p.$x};top:${p=>p.$y};
  width:${p=>p.$size}px;height:${p=>p.$size}px;border-radius:50%;
  background:rgba(139,92,246,.2);pointer-events:none;
  animation:${pulseDot} ${p=>3+parseFloat(p.$delay)}s ease-in-out ${p=>p.$delay} infinite;
`;
