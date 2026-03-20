import styled, { css } from 'styled-components';
import { theme } from '@/theme/theme';

export const Container = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

export const RadioPill = styled.div<{ $isActive?: boolean }>`
    padding: 6px 14px;
    border: 1.5px solid rgba(0, 0, 0, .1);
    border-radius: 20px;
    background: #fff;
    font-size: 12px;
    font-weight: 500;
    color: ${theme.colors.muted};
    cursor: pointer;
    transition: all .18s;

    ${props => props.$isActive && css`
        border-color: ${theme.colors.primary};
        background: rgba(155, 93, 229, .1);
        color: ${theme.colors.primary};
        font-weight: 600;
    `}

    &:hover {
        border-color: ${theme.colors.primary};
        background: rgba(155, 93, 229, .05);
    }
`;

export const styles: Record<string, any> = {};
