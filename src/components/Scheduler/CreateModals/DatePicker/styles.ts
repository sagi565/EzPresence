import styled, { css } from 'styled-components';
import { theme } from '@/theme/theme';

export const Container = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    background: ${theme.colors.surface};
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0,0,0,.18);
    border: 1px solid rgba(155, 93, 229, .12);
    padding: 16px;
    z-index: 50;
    width: 280px;
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    marginBottom: 12px;
`;

export const Title = styled.span`
    font-size: 14px;
    font-weight: 700;
    color: ${theme.colors.text};
`;

export const Arrow = styled.button`
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    color: ${theme.colors.muted};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .15s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    text-align: center;
`;

export const DayHeader = styled.div`
    font-size: 11px;
    font-weight: 600;
    color: ${theme.colors.muted};
    padding: 4px 0;
`;

export const Day = styled.button<{ $isToday?: boolean; $isSelected?: boolean; $isOtherMonth?: boolean }>`
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    fontSize: 13px;
    font-weight: 500;
    color: ${theme.colors.text};
    transition: all .15s;
    border: none;
    background: transparent;
    margin: auto;

    ${props => props.$isToday && css`
        font-weight: 700;
        color: ${theme.colors.primary};
    `}

    ${props => props.$isSelected && css`
        background: ${theme.colors.primary} !important;
        color: #fff !important;
        font-weight: 700;
    `}

    ${props => props.$isOtherMonth && css`
        color: #d1d5db;
        cursor: default;
    `}

    &:hover:not(:disabled) {
        background-color: rgba(155, 93, 229, 0.1);
        font-weight: 600;

        ${props => props.$isSelected && css`
            background-color: ${theme.colors.primary} !important;
            color: #fff !important;
        `}
    }

    &:disabled {
        color: #d1d5db;
        cursor: not-allowed;
        opacity: 0.5;
    }
`;
