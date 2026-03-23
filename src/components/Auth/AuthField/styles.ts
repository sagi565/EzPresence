import styled from 'styled-components';

export const Wrapper = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.muted};
`;

export const Input = styled.input`
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  outline: none;
  padding: 0 12px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
`;
