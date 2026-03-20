import styled, { keyframes } from 'styled-components';
import { theme } from '@/theme/theme';

const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
`;

export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Dialog = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 28px 32px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    animation: ${fadeIn} 0.2s ease-out;
`;

export const TitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
`;

export const DangerIcon = styled.div`
    width: '40px';
    height: '40px';
    border-radius: '50%';
    background: 'rgba(239, 68, 68, 0.1)';
    display: 'flex';
    align-items: 'center';
    justify-content: 'center';
    flex-shrink: 0;
`;

export const Title = styled.h3`
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: ${theme.colors.text};
`;

export const Message = styled.p`
    margin: 0 0 24px 0;
    font-size: 14px;
    color: ${theme.colors.muted};
    line-height: 1.5;
`;

export const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

export const CancelBtn = styled.button`
    padding: 9px 20px;
    border-radius: 10px;
    border: 1px solid #E5E7EB;
    background: #fff;
    color: ${theme.colors.text};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
        background: #f9fafb;
    }
`;

export const ConfirmBtn = styled.button<{ $danger?: boolean }>`
    padding: 9px 20px;
    border-radius: 10px;
    border: none;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    background: ${props => props.$danger ? '#EF4444' : theme.gradients.innovator};
    box-shadow: ${props => props.$danger
        ? '0 3px 12px rgba(239, 68, 68, 0.3)'
        : '0 3px 12px rgba(155, 93, 229, 0.25)'};

    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;
