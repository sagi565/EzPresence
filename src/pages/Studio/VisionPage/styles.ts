import styled, { keyframes } from 'styled-components';

export const fadeInUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
export const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
export const fadeOut  = keyframes`from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(1.06)}`;
const bgAnim          = keyframes`0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}`;

/* Main content area — left edge set dynamically via style prop to match sidebar width */
export const VisionContainer = styled.div`
  position: fixed;
  top: 0; right: 0; bottom: 0;
  /* left is set via inline style from VisionPage */
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(-45deg,
    ${p => p.theme.colors.bg},
    rgba(139,92,246,.03),
    ${p => p.theme.colors.bg},
    rgba(109,40,217,.02)
  );
  background-size: 300% 300%;
  animation: ${bgAnim} 20s ease-in-out infinite;
  transition: left .22s cubic-bezier(.4,0,.2,1);
`;

export const BackBtn = styled.button`
  position: fixed; right: 24px; top: 24px; z-index: 20;
  display: inline-flex; align-items: center; gap: 6px;
  background: ${p => p.theme.colors.surface};
  border: 1.5px solid rgba(139,92,246,.12); border-radius: 10px;
  padding: 7px 14px; cursor: pointer; font-size: 12.5px; font-weight: 700;
  color: ${p => p.theme.colors.muted}; font-family: inherit; transition: all .18s;
  white-space: nowrap;
  &:hover { border-color: rgba(139,92,246,.35); background: rgba(139,92,246,.06); }
  @media (max-width: 768px) { top: 18px; right: 16px; }
`;

export const BackBtnLabel = styled.span`color: ${p => p.theme.colors.muted};`;

export const BackBtnAccent = styled.span`
  background: linear-gradient(135deg,#9b5de5 0%,#fbbf24 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const LogoMark = styled.a`
  position: fixed; left: calc(var(--sidebar-w, 0px) + 24px); top: 24px; z-index: 20;
  font-size: 32px; font-weight: 800; letter-spacing: -0.5px;
  background: linear-gradient(135deg,#9b5de5 0%,#fbbf24 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; text-decoration: none; cursor: default;
  pointer-events: none; white-space: nowrap; line-height: 1;
  transition: left .22s cubic-bezier(.4,0,.2,1);
  @media (max-width: 768px) {
    font-size: 22px;
    left: calc(var(--sidebar-w, 0px) + 14px);
    top: 20px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex; flex-direction: column; align-items: center;
  gap: 24px; width: 100%; max-width: 700px;
  padding: 80px 24px 100px;
  overflow-y: auto; overflow-x: hidden;
  height: 100%;
  position: relative; z-index: 1;
  animation: ${fadeInUp} .7s cubic-bezier(.4,0,.2,1) both;
  scrollbar-width: thin; scrollbar-color: rgba(139,92,246,.15) transparent;
`;

export const Banner = styled.div<{ $ok: boolean }>`
  width: 100%; padding: 11px 15px;
  background: ${p => p.$ok ? 'rgba(34,197,94,.07)' : 'rgba(239,68,68,.07)'};
  border: 1px solid ${p => p.$ok ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.18)'};
  border-radius: 12px; font-size: 13px; font-weight: 500;
  color: ${p => p.$ok ? '#16a34a' : '#ef4444'};
`;

export const VersionToggle = styled.div`
  position: fixed; right: 185px; top: 24px; z-index: 20;
  display: flex; border-radius: 9px; overflow: hidden;
  border: 1.5px solid rgba(139,92,246,.15);
  background: ${p => p.theme.colors.surface};
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
`;

export const VersionBtn = styled.button<{ $active: boolean }>`
  padding: 6px 13px; font-size: 11.5px; font-weight: 700;
  font-family: inherit; border: none; cursor: pointer;
  background: ${p => p.$active ? 'rgba(139,92,246,.12)' : 'transparent'};
  color: ${p => p.$active ? '#a78bfa' : p.theme.colors.muted};
  transition: all .15s;
  border-right: 1px solid rgba(139,92,246,.08);
  &:last-child { border-right: none; }
  &:hover { background: rgba(139,92,246,.05); }
`;
