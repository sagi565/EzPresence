import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

const BaseButton = styled.button`
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
`;

export const GoogleBtn = styled(BaseButton)`
  background: #fff;
  color: #3c4043;
  border: 1px solid #dadce0;
`;

export const FacebookBtn = styled(BaseButton)`
  background: #1877F2;
  color: #fff;
  border: none;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;
