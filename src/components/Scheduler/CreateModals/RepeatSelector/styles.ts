import styled, { css } from 'styled-components';
import { theme } from '@/theme/theme';

export const Container = styled.div<{ $show?: boolean }>`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    background: ${theme.colors.surface};
    border-radius: 14px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, .14);
    border: 1px solid rgba(0, 0, 0, .06);
    padding: 6px;
    minWidth: 280px;
    z-index: 50;
    display: ${props => props.$show ? 'block' : 'none'};

    @media (max-width: ${theme.breakpoints.mobile}) {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 2000 !important;
    }
`;

export const Option = styled.button<{ $isActive?: boolean }>`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: ${theme.colors.text};
    cursor: pointer;
    textAlign: left;
    transition: all .12s;

    &:hover {
        background: #f0f1f3 !important;
    }

    ${props => props.$isActive && css`
        background: rgba(155, 93, 229, .06) !important;
        color: ${theme.colors.primary};
        font-weight: 600;
    `}
`;

export const styles: Record<string, any> = {};
