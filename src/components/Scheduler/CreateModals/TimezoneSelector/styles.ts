import styled, { css } from 'styled-components';
import { theme } from '@/theme/theme';

export const Container = styled.div<{ $show?: boolean }>`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 280px;
    max-height: 300px;
    background: ${theme.colors.surface};
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, .14);
    border: 1px solid rgba(0, 0, 0, .06);
    z-index: 1000;
    display: ${props => props.$show ? 'flex' : 'none'};
    flex-direction: column;
    overflow: hidden;
    font-size: 13px;
    padding: 8px 0;

    @media (max-width: ${theme.breakpoints.mobile}) {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 2000 !important;
        width: 90vw !important;
        max-width: 320px !important;
    }
`;

export const SearchBox = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, .06);
    flex-shrink: 0;
`;

export const SearchIcon = styled.span`
    font-size: 14px;
    opacity: 0.5;
`;

export const SearchInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    font-size: 13px;
    font-family: inherit;
    color: ${theme.colors.text};
    background: transparent;
`;

export const List = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 4px;
`;

export const Item = styled.div<{ $isSelected?: boolean }>`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all .15s;
    position: relative;

    &:hover {
        background: rgba(155, 93, 229, .06);
    }

    ${props => props.$isSelected && css`
        background: rgba(155, 93, 229, .1) !important;
    `}
`;

export const Flag = styled.div`
    font-size: 18px;
    flex-shrink: 0;
    width: 24px;
    text-align: center;
`;

export const Info = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
`;

export const LabelRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
`;

export const Label = styled.span`
    fontSize: 13px;
    font-weight: 500;
    color: ${theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const Offset = styled.span`
    font-size: 11px;
    font-weight: 500;
    color: ${theme.colors.muted};
    font-family: 'monospace';
    flex-shrink: 0;
`;

export const Country = styled.div`
    font-size: 11px;
    color: ${theme.colors.muted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const Checkmark = styled.span`
    font-size: 14px;
    color: ${theme.colors.primary} !important;
    font-weight: 700;
    flex-shrink: 0;
    margin-left: 4px;
`;

export const NoResults = styled.div`
    padding: 24px 16px;
    textAlign: center;
    fontSize: 13px;
    color: ${theme.colors.muted};
`;

export const styles: Record<string, any> = {};
