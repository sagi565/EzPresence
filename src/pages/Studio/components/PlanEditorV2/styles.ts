import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;

export const Wrap = styled.div`
  width:100%;height:100%;
  display:flex;flex-direction:column;
  min-height:0;
  animation:${fadeUp} .5s cubic-bezier(.4,0,.2,1) both;
`;
