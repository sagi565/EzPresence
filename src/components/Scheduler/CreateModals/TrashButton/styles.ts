import styled, { css } from 'styled-components';
import { theme } from '@/theme/theme';

export const Button = styled.button<{ $hasChildren?: boolean; $disabled?: boolean }>`
    width: ${props => props.$hasChildren ? 'auto' : '32px'};
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: ${props => props.$hasChildren ? '12px' : '50%'};
    background: rgba(239, 68, 68, .1);
    color: #EF4444;
    cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s ease;
    padding: ${props => props.$hasChildren ? '0 16px' : '0'};
    position: relative;
    overflow: visible;
    outline: none;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;

    &:hover:not(:disabled) {
        background: rgba(239, 68, 68, .2);
        color: #DC2626;

        .trash-lid {
            transform: translateY(-2px) rotate(-15deg);
        }
    }

    &:disabled {
        opacity: 0.5;
    }
`;

export const Lid = styled.g`
    transform-origin: 4px 7px;
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const styles: Record<string, any> = {};
