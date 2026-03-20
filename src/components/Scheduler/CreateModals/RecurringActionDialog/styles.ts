import styled, { keyframes, css } from 'styled-components';
import { theme } from '@/theme/theme';

const dialogAppear = keyframes`
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
`;

export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

export const Dialog = styled.div`
    background: #fff;
    border-radius: 24px;
    padding: 32px;
    width: 420px;
    max-width: 100%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: ${dialogAppear} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
`;

export const Title = styled.h3`
    font-size: 20px;
    font-weight: 700;
    color: ${theme.colors.text};
    margin: 0;
`;

export const OptionsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const OptionItem = styled.label<{ $isSelected?: boolean; $isDisabled?: boolean }>`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 12px;
    background: ${props => props.$isSelected ? 'rgba(155, 93, 229, 0.05)' : '#F9FAFB'};
    cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
    font-size: 15px;
    font-weight: 500;
    color: ${theme.colors.text};
    user-select: none;
    transition: all 0.2s;
    border: 1px solid ${props => props.$isSelected ? theme.colors.primary : '#E5E7EB'};
    opacity: ${props => props.$isDisabled ? 0.45 : 1};

    &:hover {
        ${props => !props.$isDisabled && css`
            border-color: ${theme.colors.primary};
            background: rgba(155, 93, 229, 0.03);
        `}
    }
`;

export const RadioInput = styled.div<{ $isSelected?: boolean }>`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid ${props => props.$isSelected ? theme.colors.primary : '#D1D5DB'};
    margin-right: 12px;
    position: relative;
    flex-shrink: 0;
    transition: all 0.2s;
    background: #fff;

    ${props => props.$isSelected && css`
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${theme.colors.primary};
        }
    `}
`;

export const OptionLabel = styled.span`
    flex: 1;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 8px;
`;

export const Button = styled.button`
    padding: 10px 24px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
`;

export const CancelBtn = styled(Button)`
    background: #fff;
    color: ${theme.colors.text};
    border: 1px solid #E5E7EB;

    &:hover {
        background: #F9FAFB;
        border-color: #D1D5DB;
    }
`;

export const ConfirmBtn = styled(Button)<{ $isDelete?: boolean }>`
    background: ${props => props.$isDelete ? 'linear-gradient(135deg, #ef4444, #dc2626)' : theme.gradients.innovator};
    color: #fff;
    box-shadow: 0 4px 12px ${props => props.$isDelete ? 'rgba(239, 68, 68, 0.25)' : 'rgba(155, 93, 229, 0.25)'};

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px ${props => props.$isDelete ? 'rgba(239, 68, 68, 0.35)' : 'rgba(155, 93, 229, 0.35)'};
    }

    &:active {
        transform: translateY(0);
    }
`;

export const InfoIconWrapper = styled.span`
    position: relative;
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    cursor: help;
`;

export const InfoBadge = styled.span`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(155, 93, 229, 0.12);
    color: #9b5de5;
    font-size: 11px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    user-select: none;
`;

export const Tooltip = styled.div`
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a2e;
    color: #fff;
    padding: 7px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 400;
    z-index: 9999;
    line-height: 1.5;
    width: 200px;
    white-space: pre-wrap;
    text-align: center;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
`;

export const styles: Record<string, any> = {};
