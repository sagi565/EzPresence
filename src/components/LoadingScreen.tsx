import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  gap: 20px;
  background: ${props => props.theme.gradients.background};
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${props => props.theme.colors.primary}33;
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const MessageText = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: 16px;
  font-weight: 500;
`;

const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
    return (
        <LoadingContainer>
            <Spinner />
            <MessageText>
                {message}
            </MessageText>
        </LoadingContainer>
    );
};

export default LoadingScreen;
