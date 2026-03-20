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
    padding: 8px 6px;
    z-index: 50;
    width: 270px;
    display: ${props => props.$show ? 'block' : 'none'};

    @media (max-width: ${theme.breakpoints.mobile}) {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 2000 !important;
    }
`;

export const Header = styled.div`
    display: flex;
    padding: 0 6px 4px;
`;

export const HeaderLabel = styled.div`
    flex: 1;
    text-align: center;
    font-size: 9px;
    font-weight: 700;
    color: ${theme.colors.muted};
    text-transform: uppercase;
    letter-spacing: .6px;
`;

export const Wheel = styled.div`
    display: flex;
    align-items: stretch;
    position: relative;
    height: 180px;

    &::before {
        content: '';
        position: absolute;
        left: 6px;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        height: 36px;
        background: rgba(155, 93, 229, .08);
        border-radius: 8px;
        pointer-events: none;
        z-index: 0;
    }
`;

export const WheelCol = styled.div`
    flex: 1;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
    position: relative;
    z-index: 1;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const WheelItem = styled.button<{ $isActive?: boolean }>`
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 500;
    color: rgba(0, 0, 0, .35);
    cursor: pointer;
    scroll-snap-align: center;
    flex-shrink: 0;
    transition: all .15s;
    user-select: none;
    border: none;
    background: transparent;
    width: 100%;
    font-family: inherit;
    padding: 0;

    &:hover {
        color: rgba(0, 0, 0, .55);
    }

    ${props => props.$isActive && css`
        color: ${theme.colors.text} !important;
        font-weight: 600 !important;
    `}
`;

export const Spacer = styled.div`
    height: 72px;
    flex-shrink: 0;
    scroll-snap-align: none;
`;

export const Separator = styled.div`
    width: 14px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: ${theme.colors.muted};
    z-index: 1;
`;

export const styles: Record<string, any> = {};
