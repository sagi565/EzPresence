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
    transition: border-color .2s ease, border-bottom-width .15s ease;

    &:hover {
        border-bottom: 1px solid #b796df !important;
    }

    &:focus {
        border-bottom: 2.5px solid ${theme.colors.primary} !important;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        width: 100% !important;
        margin-left: 0 !important;
        padding: 0 0 6px 0 !important;
        font-size: 20px !important;
        box-sizing: border-box !important;
    }
`;

export const ErrorText = styled.span`
    color: #EF4444;
    font-size: 12px;
    font-weight: 500;
    margin-left: 0;
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

export const ChipRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: center;
`;

export const PlatformSection = styled.div<{ $color: string; $checked: boolean; $isExpanded: boolean }>`
    border-radius: 12px;
    border: 1.5px solid rgba(0,0,0,.06);
    border-left-width: 3px;
    border-left-color: ${props => props.$checked ? props.$color : 'rgba(0,0,0,0.1)'};
    overflow: visible;
    transition: all .25s cubic-bezier(.4,0,.2,1);
    margin-bottom: 12px;
    background: #fff;
    ${props => props.$isExpanded && css`
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    `}
`;

export const PlatformHeader = styled.div<{ $checked: boolean; $color: string }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    cursor: pointer;
    user-select: none;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    transition: background .15s;
    background: ${props => props.$checked ? `${props.$color}08` : 'transparent'};
`;

export const PlatformHeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const PlatformCheckbox = styled.div<{ $checked: boolean; $color: string }>`
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 1.5px solid ${props => props.$checked ? props.$color : 'rgba(0,0,0,0.15)'};
    background: ${props => props.$checked ? props.$color : 'transparent'};
    cursor: ${props => props.$checked ? 'pointer' : 'default'};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .18s;
    flex-shrink: 0;
    margin-right: 10px;

    span {
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
    }
`;

export const ProfileImageWrapper = styled.div`
    position: relative;
    width: 34px;
    height: 34px;
`;

export const ProfileImage = styled.img`
    width: 34px;
    height: 34px;
    border-radius: 9px;
    object-fit: cover;
    border: 1.5px solid rgba(255,255,255,.4);
    box-shadow: 0 1px 4px rgba(251, 191, 36, 0.15);
`;

export const ProfilePlaceholder = styled.div`
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid rgba(255,255,255,.4);
    color: #9ca3af;
    font-size: 17px;
`;

export const PlatformIndicator = styled.div`
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 18px;
    height: 18px;
    border-radius: 5px;
    background: #fff;
    border: 1.5px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;

    img {
        width: 14px;
        height: 14px;
    }
`;

export const PlatformInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    gap: 1px;
`;

export const PlatformName = styled.span`
    font-size: 13.5px;
    font-weight: 400;
    color: ${theme.colors.text};
    letter-spacing: 0.02em;
`;

export const PlatformUsername = styled.span`
    font-size: 11px;
    font-weight: 600;
    color: ${theme.colors.muted};
`;

export const ExpandIcon = styled.div<{ $isExpanded: boolean }>`
    transform: ${props => props.$isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'};
    transition: transform 0.2s;
    color: ${theme.colors.muted};
    font-size: 12px;
`;

export const PlatformBody = styled.div`
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    border-top: 1px solid rgba(0,0,0,.06);
    background: rgba(0,0,0,.02);
`;

export const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const FieldLabel = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: ${theme.colors.muted};
    display: flex;
    align-items: center;
    gap: 6px;

    span.optional {
        font-weight: 400;
        font-size: 10px;
        color: #999;
    }
`;

export const FieldInput = styled.input`
    width: 100%;
    padding: 8px 12px;
    border: 1.5px solid rgba(0, 0, 0, .1);
    border-radius: 8px;
    font-size: 13px;
    font-family: inherit;
    color: ${theme.colors.text};
    background: #fff;
    outline: none;
    transition: all .18s;

    &:focus {
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(155, 93, 229, 0.08);
    }
`;

export const FieldSelect = styled.select`
    width: 100%;
    padding: 8px 12px;
    border: 1.5px solid rgba(0, 0, 0, .1);
    border-radius: 8px;
    font-size: 13px;
    font-family: inherit;
    color: ${theme.colors.text};
    background: #fff;
    outline: none;
    transition: all .18s;

    &:focus {
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(155, 93, 229, 0.08);
    }
`;

export const TooltipWrapper = styled.span`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: rgba(155,93,229,.1);
    font-size: 9px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #7c3aed;
    cursor: help;
    font-style: italic;
    flex-shrink: 0;
    position: relative;
    margin-left: 4px;
`;

export const TooltipContent = styled.span`
    display: block;
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
    width: 220px;
    z-index: 1800;
    box-shadow: 0 4px 16px rgba(0,0,0,.25);
    pointer-events: none;
`;

export const DraftBtn = styled.button`
    padding: 10px 22px;
    border-radius: 10px;
    border: none;
    background: #fff;
    color: ${theme.colors.muted};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .08);
    transition: all .18s;

    &:hover {
        background: #fdfdfd;
        box-shadow: 0 2px 8px rgba(0,0,0,.12);
    }
`;

export const ScheduleBtn = styled.button`
    padding: 10px 28px;
    border-radius: 10px;
    border: none;
    background: ${theme.gradients.innovator};
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 3px 12px rgba(155, 93, 229, .25);
    transition: all .2s;

    &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 5px 15px rgba(155, 93, 229, .35);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        filter: grayscale(0.5);
    }
`;

export const PlatformsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const RightColumnWrapper = styled.div`
    position: relative;
    
    @media (max-width: ${theme.breakpoints.mobile}) {
        #npmContentPreview {
            width: 110px !important;
            max-width: 110px !important;
            height: 100% !important;
            min-height: 150px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
        }
    }
`;

export const styles: Record<string, any> = {};
