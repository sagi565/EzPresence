import styled, { keyframes, css } from 'styled-components';

const nsmShimmer = keyframes`
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
`;

const nsmDotBounce = keyframes`
    0%, 80%, 100% { transform: scale(0.65); opacity: 0.35; }
    40%           { transform: scale(1);    opacity: 1;    }
`;

const contentFadeIn = keyframes`
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1);    }
`;

export const PreviewShell = styled.div<{ $hasContent?: boolean; $dropHover?: boolean; $pickElevated?: boolean }>`
    width: 100%;
    aspect-ratio: 9/16;
    border-radius: 14px;
    border: 2px dashed rgba(0, 0, 0, .1);
    background: #f8f9fb;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease;
    overflow: hidden;
    position: relative;

    &:hover {
        ${props => !props.$hasContent && css`
            border-color: rgba(155, 93, 229, 0.4);
        `}
    }

    ${props => props.$dropHover && css`
        border-color: #9b5de5 !important;
        border-style: solid !important;
        background: rgba(155, 93, 229, .08) !important;
    `}

    ${props => props.$hasContent && css`
        border: none !important;
        border-width: 0 !important;
        outline: none !important;
        background: transparent !important;

        ${props.$dropHover && css`
            outline: 2px solid rgba(251,191,36,0.8) !important;
            outline-offset: 2px !important;
        `}
    `}

    ${props => props.$pickElevated && css`
        border: 2px dashed #9b5de5 !important;
        background: rgba(155, 93, 229, .04) !important;
        box-shadow: 0 0 0 3px rgba(155,93,229,0.25), 0 8px 32px rgba(155,93,229,0.2);
    `}
`;

export const Placeholder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    pointer-events: none;
`;

export const PlaceholderIcon = styled.span`
    font-size: 32px;
    opacity: .7;
`;

export const PlaceholderText = styled.span`
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    padding: 0 8px;
`;

export const LoadingContainer = styled.div`
    position: absolute;
    inset: 0;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f0ebfa 0%, #f8f5fd 50%, #f0ebfa 100%);
    overflow: hidden;
    pointer-events: none;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            rgba(255,255,255,0)   0%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0)   100%
        );
        background-size: 400px 100%;
        animation: ${nsmShimmer} 1.4s infinite linear;
    }
`;

export const ShimmerBar = styled.div`
    position: relative;
    overflow: hidden;
    background: rgba(155, 93, 229, 0.14);
    flex-shrink: 0;
    z-index: 1;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            rgba(255,255,255,0)   0%,
            rgba(255,255,255,0.7) 50%,
            rgba(255,255,255,0)   100%
        );
        background-size: 400px 100%;
        animation: ${nsmShimmer} 1.4s infinite linear;
    }
`;

export const LoadingDots = styled.div`
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 5px;
    z-index: 1;
`;

export const LoadingDot = styled.div<{ $delay: string }>`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(155, 93, 229, 0.55);
    animation: ${nsmDotBounce} 1.2s infinite ease-in-out;
    animation-delay: ${props => props.$delay};
`;

export const FilledContent = styled.div<{ $ready: boolean; $bgImage?: string; $isEmptyFallback?: boolean }>`
    position: absolute;
    inset: 0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    overflow: hidden;
    pointer-events: none;
    background-image: ${props => props.$bgImage ? `url(${props.$bgImage})` : 'none'};
    background-color: ${props => props.$isEmptyFallback ? 'rgba(155, 93, 229, 0.08)' : 'transparent'};
    opacity: ${props => props.$ready ? 1 : 0};
    transform: ${props => props.$ready ? 'scale(1)' : 'scale(0.97)'};
    animation: ${props => props.$ready ? css`${contentFadeIn} 0.28s cubic-bezier(0.16,1,0.3,1) forwards` : 'none'};
`;

export const FilledTitle = styled.div`
    position: absolute;
    bottom: 0; left: 0; right: 0;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    padding: 14px 10px 8px;
    text-shadow: 0 1px 3px rgba(0,0,0,.8);
    background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
    z-index: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const RemoveButton = styled.button`
    position: absolute;
    top: 6px; right: 6px;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: rgba(0,0,0,.5);
    color: #fff;
    border: none;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity .15s;
    z-index: 3;

    ${PreviewShell}:hover & {
        opacity: 1;
    }
`;

export const EmotionFallback = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    z-index: 1;
    opacity: 0.5;
    pointer-events: none;
`;

export const VideoPlayer = styled.video`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    pointer-events: none;
`;

export const styles: Record<string, any> = {};