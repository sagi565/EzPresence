import styled, { css } from 'styled-components';
import { theme } from '@/theme/theme';

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
`;

export const Label = styled.div`
    font-size: 13px;
    font-weight: 500;
    color: ${theme.colors.text};
    display: flex;
    align-items: center;
    gap: 6px;
`;

export const ToggleSwitch = styled.div<{ $on?: boolean }>`
    position: relative;
    width: 38px;
    height: 22px;
    background: ${props => props.$on ? theme.colors.primary : '#d1d5db'};
    border-radius: 11px;
    cursor: pointer;
    transition: background .2s;
    flex-shrink: 0;
`;

export const ToggleThumb = styled.div<{ $on?: boolean }>`
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 50%;
    transition: transform .2s;
    box-shadow: 0 1px 3px rgba(0,0,0,.2);
    transform: ${props => props.$on ? 'translateX(16px)' : 'none'};
`;

export const TooltipWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const TooltipIcon = styled.span`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: rgba(155, 93, 229, .1);
    font-size: 9px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.primary};
    cursor: help;
    flex-shrink: 0;
    font-style: italic;
`;

export const TooltipBubble = styled.div`
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: #111827;
    color: #fff;
    font-size: 11px;
    font-weight: 400;
    line-height: 1.4;
    padding: 8px 12px;
    border-radius: 8px;
    white-space: pre-line;
    width: 200px;
    z-index: 1800;
    box-shadow: 0 4px 16px rgba(0,0,0,.25);
    pointer-events: none;

    &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: #111827;
        width: 0;
        height: 0;
    }
`;

export const styles: Record<string, any> = {};
