import styled, { keyframes } from 'styled-components';

const floatUp  = keyframes`from{opacity:0;transform:translateY(40px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}`;
const barSlide = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;

export const ReadyWrapper = styled.div`
  width:100%;max-width:780px;position:relative;z-index:1;
  padding-bottom:130px;
  animation:${floatUp} .6s cubic-bezier(.34,1.1,.64,1) .1s both;
`;

export const FloatingBar = styled.div`
  position:fixed;bottom:0;left:0;right:0;z-index:100;
  display:flex;justify-content:center;align-items:flex-end;gap:10px;
  padding:10px 24px 16px;
  background:linear-gradient(to top,${p=>p.theme.colors.bg} 45%,transparent);
  animation:${barSlide} .5s cubic-bezier(.4,0,.2,1) .2s both;
`;

export const FloatingInner = styled.div`
  flex:1;max-width:600px;
  background:${p=>p.theme.colors.surface}99;
  border:1.5px solid rgba(139,92,246,.12);border-radius:16px;
  box-shadow:0 -2px 18px rgba(139,92,246,.06),0 4px 18px rgba(0,0,0,.12);
  overflow:hidden;backdrop-filter:blur(18px);
`;

