import styled, { keyframes, css } from 'styled-components';
import { theme } from '@/theme/theme';

const shatter = keyframes`
    0% { transform: scale(1) translate(0, 0) rotate(0); opacity: 1; filter: blur(0); }
    20% { transform: scale(1.02) translate(2px, -2px) rotate(1deg); filter: blur(1px); opacity: 0.9; }
    40% { transform: scale(0.95) translate(-4px, 4px) rotate(-2deg); filter: blur(2px); opacity: 0.7; }
    100% { transform: scale(0.6) translate(0, 50px) rotate(5deg); opacity: 0; filter: blur(10px); }
`;

export const ModalWrapper = styled.div<{ $isShattering?: boolean }>`
    transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease, filter 0.5s ease;

    ${props => props.$isShattering && css`
        &.shatter-animation .schedule-modal-layout {
            animation: ${shatter} 0.6s forwards;
        }
    `}

    @media (max-width: ${theme.breakpoints.mobile}) {
        .time-picker, .date-picker, .timezone-selector, .repeat-selector {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 2000 !important;
        }

        .section-icon {
            display: none !important;
        }

        .schedule-modal-layout-left {
            align-items: center !important;
            width: 100% !important;
        }

        .schedule-modal-layout-left > div {
            width: 100% !important;
            justify-content: center !important;
            align-items: center !important;
        }

        .schedule-modal-layout-left .section-content-wrapper {
            align-items: center !important;
        }

        .chip-row-container {
            flex-wrap: nowrap !important;
            width: 100% !important;
            justify-content: space-between !important;
            gap: 4px !important;
        }
    }
`;

export const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const TitleInput = styled.input<{ $hasError?: boolean }>`
    width: calc(70% - 28px);
    border: none;
    border-bottom: 1px solid ${props => props.$hasError ? '#EF4444' : 'rgba(0, 0, 0, .1)'};
    outline: none;
    font-size: 22px;
    font-weight: 700;
    color: ${theme.colors.text};
    padding: 16px 0 6px;
    margin-left: 28px;
    background: transparent;
    font-family: inherit;
    transition: all .2s ease;

    &:hover {
        border-bottom: 1px solid #b796df !important;
    }

    &:focus {
        border-bottom: 2.5px solid ${theme.colors.primary} !important;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        width: 100% !important;
        margin-left: 0 !important;
        text-align: center !important;
        font-size: 20px !important;
        padding: 10px 0 !important;
        box-sizing: border-box !important;
    }
`;

export const ErrorText = styled.span`
    color: #EF4444;
    font-size: 12px;
    font-weight: 500;
    margin-top: 4px;
`;

export const Section = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 14px;
`;

export const SectionIcon = styled.div`
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    margin-top: 4px;
    opacity: 0.65;
`;

export const SectionContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const Label = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: ${theme.colors.muted};
`;

export const PlatformRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const PlatformBtn = styled.button<{ $isSelected?: boolean; $color: string }>`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    border: 1.5px solid ${props => props.$isSelected ? props.$color : 'rgba(0, 0, 0, .08)'};
    border-radius: 12px;
    background: ${props => props.$isSelected ? `${props.$color}08` : '#fff'};
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.$isSelected ? theme.colors.text : theme.colors.muted};
    cursor: pointer;
    transition: all .2s ease;
    position: relative;
    white-space: nowrap;

    &:hover {
        border-color: ${props => props.$isSelected ? props.$color : 'rgba(155, 93, 229, .2)'} !important;
        background: ${props => props.$isSelected ? `${props.$color}0C` : '#faf8ff'} !important;
        color: ${theme.colors.text} !important;
    }
`;

export const PlatformIcon = styled.div<{ $color: string }>`
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 900;
    color: #fff;
    background: ${props => props.$color};
    transition: all .2s;
`;

export const RightColumnWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    flex-shrink: 0;

    @media (max-width: ${theme.breakpoints.mobile}) {
        width: 100% !important;
        
        #nsmContentPreview {
            height: 140px !important;
            width: 80px !important;
            margin: 0 auto !important;
        }
    }
`;

export const DraftBtn = styled.button`
    padding: 10px 22px;
    border: none;
    border-radius: 10px;
    background: #fff;
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.muted};
    cursor: pointer;
    transition: all .18s;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .08);

    &:hover:not(:disabled) {
        color: ${theme.colors.primary} !important;
        box-shadow: 0 2px 8px rgba(155, 93, 229, .15) !important;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const ScheduleBtn = styled.button`
    padding: 10px 28px;
    border: none;
    border-radius: 10px;
    background: ${theme.gradients.innovator};
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s;
    box-shadow: 0 3px 12px rgba(155, 93, 229, .25);

    &:hover:not(:disabled) {
        transform: translateY(-1px) !important;
        box-shadow: 0 5px 18px rgba(155, 93, 229, .35) !important;
    }

    &:active:not(:disabled) {
        transform: translateY(0) !important;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

export const styles: Record<string, any> = {};
