import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  animation: ${fadeIn} 0.18s ease both;
`;

export const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);
  width: min(400px, 90vw);
  background: ${p => p.theme.colors.surface};
  border: 1.5px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 32px 28px 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(139, 92, 246, 0.08);
  animation: ${slideUp} 0.22s cubic-bezier(0.34, 1.1, 0.64, 1) both;
  text-align: center;
`;

export const IconWrap = styled.div<{ $danger?: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  background: ${p => p.$danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)'};
  color: ${p => p.$danger ? '#ef4444' : '#9b5de5'};
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  margin-bottom: 8px;
  letter-spacing: -0.01em;
`;

export const Message = styled.div`
  font-size: 14px;
  line-height: 1.65;
  color: ${p => p.theme.colors.muted};
  margin-bottom: 28px;
  white-space: pre-line;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.button<{ $danger?: boolean; $primary?: boolean }>`
  flex: 1;
  padding: 11px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
  letter-spacing: 0.01em;

  ${p => p.$danger && css`
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #fff;
    border: none;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
    &:hover { box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5); transform: translateY(-1px); }
  `}

  ${p => p.$primary && css`
    background: linear-gradient(135deg, #9b5de5 0%, #7c3aed 100%);
    color: #fff;
    border: none;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.35);
    &:hover { box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5); transform: translateY(-1px); }
  `}

  ${p => !p.$danger && !p.$primary && css`
    background: rgba(139, 92, 246, 0.07);
    color: ${p.theme.colors.muted};
    border: 1.5px solid rgba(139, 92, 246, 0.12);
    &:hover { background: rgba(139, 92, 246, 0.12); border-color: rgba(139, 92, 246, 0.25); }
  `}
`;
