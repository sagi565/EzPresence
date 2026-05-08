import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.4) rotate(-45deg); }
  to   { opacity: 1; transform: scale(1)   rotate(0deg);   }
`;

export const ToggleBtn = styled.button<{ $dark: boolean }>`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1.5px solid ${p => p.$dark ? 'rgba(167,139,250,.3)' : 'rgba(139,92,246,.2)'};
  background: ${p => p.$dark ? 'rgba(167,139,250,.12)' : 'rgba(139,92,246,.08)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s, border-color 0.25s;
  flex-shrink: 0;
  padding: 0;

  &:hover {
    background: ${p => p.$dark ? 'rgba(167,139,250,.22)' : 'rgba(139,92,246,.16)'};
    border-color: ${p => p.$dark ? 'rgba(167,139,250,.5)' : 'rgba(139,92,246,.4)'};
  }
`;

export const AnimatedIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${popIn} 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
`;
