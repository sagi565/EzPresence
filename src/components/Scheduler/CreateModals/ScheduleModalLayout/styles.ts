import styled, { css } from 'styled-components';
import { theme } from '@/theme/theme';

export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(17, 24, 39, 0.45);
    backdrop-filter: blur(3px);
    z-index: 1500;
`;

export const Modal = styled.div<{ $width?: string; $height?: string }>`
    position: fixed;
    top: '50%';
    left: '50%';
    transform: translate(-50%, -50%);
    z-index: 1600;
    background: ${theme.colors.surface};
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, .15), 0 0 0 1px rgba(0, 0, 0, .04);
    width: ${props => props.$width || '820px'};
    max-width: 94vw;
    height: ${props => props.$height || 'auto'};
    max-height: 88vh;
    min-height: 520px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: ${theme.breakpoints.mobile}) {
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
        border-radius: 0 !important;
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
    }
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 28px;
    background: #f8f9fb;
    border-bottom: 1px solid rgba(0, 0, 0, .05);
    flex-shrink: 0;

    @media (max-width: ${theme.breakpoints.mobile}) {
        padding: 12px 16px !important;
    }
`;

export const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const Icon = styled.span`
    font-size: 28px;
    line-height: 1;

    @media (max-width: ${theme.breakpoints.mobile}) {
        font-size: 22px !important;
    }
`;

export const Title = styled.h2`
    font-size: 22px;
    font-weight: 700;
    color: ${theme.colors.text};
    margin: 0;

    @media (max-width: ${theme.breakpoints.mobile}) {
        font-size: 18px !important;
    }
`;

export const CloseButton = styled.button`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, .06);
    color: ${theme.colors.muted};
    font-size: 18px;
    cursor: pointer;
    transition: all .2s;

    &:hover {
        background: rgba(0, 0, 0, .12);
        color: ${theme.colors.text};
    }
`;

export const Body = styled.div<{ $scrollable?: boolean }>`
    display: flex;
    gap: 24px;
    padding: 24px 28px;
    flex: 1;
    overflow-y: ${props => props.$scrollable ? 'auto' : 'hidden'};
    overflow-x: hidden;
    scrollbar-gutter: stable;

    @media (max-width: ${theme.breakpoints.mobile}) {
        flex-direction: column !important;
        padding: 16px !important;
        gap: 20px !important;
    }
`;

export const LeftColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 28px;
`;

export const RightColumn = styled.div`
    flex-shrink: 0;
    width: 240px;
    display: flex;
    flex-direction: column;

    @media (max-width: ${theme.breakpoints.mobile}) {
        width: 100% !important;
        order: -1 !important; // Content preview usually goes to top on mobile
    }
`;

export const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 28px;
    background: #f8f9fb;
    border-top: 1px solid rgba(0, 0, 0, .05);
    flex-shrink: 0;

    @media (max-width: ${theme.breakpoints.mobile}) {
        padding: 12px 16px !important;
    }
`;

export const styles: Record<string, any> = {};
