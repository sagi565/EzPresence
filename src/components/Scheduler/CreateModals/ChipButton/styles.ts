import styled, { css } from 'styled-components';
import { theme } from '@/theme/theme';

export const StyledChip = styled.div<{ $small?: boolean; $minWidth?: string; $maxWidth?: string }>`
    padding: 7px 14px;
    border: 1.5px solid rgba(0, 0, 0, .1);
    border-radius: 8px;
    background: #fff;
    font-size: 14px;
    font-weight: 500;
    color: ${theme.colors.text};
    cursor: pointer;
    transition: all .18s;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    user-select: none;

    ${props => props.$small && css`
        padding: 5px 10px;
        font-size: 12px;
        color: ${theme.colors.muted};
    `}

    ${props => props.$minWidth && css`min-width: ${props.$minWidth};`}
    ${props => props.$maxWidth && css`max-width: ${props.$maxWidth};`}

    &:hover {
        border-color: ${theme.colors.primary};
        background: ${theme.colors.primary}08;
    }
`;

// Hover style: for backwards compatibility if needed, though styled components handle hover
export const chipHoverStyle = {
    borderColor: theme.colors.primary,
    background: `${theme.colors.primary}08`,
};
