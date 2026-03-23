import { CSSProperties } from 'react';

if (typeof document !== 'undefined') {
    const styleId = 'content-preview-global-styles-v5';
    // Remove any old version so the new rules always win
    ['content-preview-global-styles', 'content-preview-global-styles-v2',
     'content-preview-global-styles-v3', 'content-preview-global-styles-v4']
        .forEach(id => document.getElementById(id)?.remove());
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }
    style.textContent = `
            /* ── Keyframes ──────────────────────────────────────────────────────── */
            @keyframes nsmShimmer {
                0%   { background-position: -400px 0; }
                100% { background-position:  400px 0; }
            }
            @keyframes nsmDotBounce {
                0%, 80%, 100% { transform: scale(0.65); opacity: 0.35; }
                40%           { transform: scale(1);    opacity: 1;    }
            }
            @keyframes contentFadeIn {
                from { op            /* ── Base preview shell ─────────────────────────────────────────────── */
            .nsm-content-preview {
                width: 100%;
                aspect-ratio: 9/16;
                border-radius: 14px;
                border: 2px dashed var(--color-primary);
                background: var(--color-bg);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
                transition: border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease;
                overflow: hidden;
                position: relative;
            }

            /* Empty — subtle border hint on hover, no background change */
            .nsm-content-preview:not(.has-content):hover {
                border-color: var(--color-primary); 
                border-width: 2.5px;
                box-shadow: 0 4px 12px rgba(var(--color-primary-rgb, 155, 93, 229), 0.1);
            }
            /* ── Unified Pick & Drag Highlight ───────────────────────────────────── */
            /* Scenario 1: Picking mode triggered by click */
            .nsm-content-preview.is-picking,
            /* Scenario 2: Dragging card from open drawer over an empty preview */
            body.content-dragging .nsm-content-preview:not(.has-content) {
                z-index: 1001 !important;
                border: 2px dashed var(--color-primary) !important;
                background: var(--color-surface) !important;
                box-shadow: 0 0 70px 20px rgba(255, 230, 0, 0.45) !important;
            }

            /* Even if it has content, elevate it visually so drop remains clear */
            body.content-dragging .nsm-content-preview.has-content {
                z-index: 1001 !important;
                background: var(--color-surface) !important;
                box-shadow: 0 0 60px 15px rgba(255, 230, 0, 0.45) !important;
            }

            /* Active drop target (matches old #pickClone dragover) */
            .nsm-content-preview.drop-hover,
            body.content-dragging .nsm-content-preview.drop-hover {
                border-color: var(--color-primary) !important;
                border-style: solid !important;
                background: var(--color-surface) !important;
                box-shadow: 0 0 80px 25px rgba(255, 230, 0, 0.55) !important;
            }

            /* Has content — zero border, zero background, clean slate */
            .nsm-content-preview.has-content {
                background: transparent !important;
            }
            /* Allow drop-hover outline even when has-content */
            .nsm-content-preview.has-content.drop-hover {
                outline: 2px solid rgba(251,191,36,0.8) !important;
                outline-offset: 2px !important;
            }

            /* ── Empty placeholder ──────────────────────────────────────────────── */
            .nsm-content-placeholder {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                color: var(--color-muted);
            }
            .nsm-content-placeholder .placeholder-icon {
                font-size: 32px;
                opacity: .7;
            }
            .nsm-content-placeholder .placeholder-text {
                font-size: 11px;
                font-weight: 500;
                text-align: center;
                padding: 0 8px;
            }

            /* ── Loading shimmer ────────────────────────────────────────────────── */
            .nsm-content-loading {
                position: absolute;
                inset: 0;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, rgba(var(--color-primary-rgb, 155, 93, 229), 0.1) 0%, rgba(var(--color-primary-rgb, 155, 93, 229), 0.05) 50%, rgba(var(--color-primary-rgb, 155, 93, 229), 0.1) 100%);
                overflow: hidden;
            }
            /* The travelling shimmer sweep */
            .nsm-content-loading::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    90deg,
                    rgba(var(--color-text-rgb, 255,255,255), 0)   0%,
                    rgba(var(--color-text-rgb, 255,255,255), 0.1) 50%,
                    rgba(var(--color-text-rgb, 255,255,255), 0)   100%
                );
                background-size: 400px 100%;
                animation: nsmShimmer 1.4s infinite linear;
            }
            .nsm-shimmer-bar {
                position: relative;
                overflow: hidden;
                background: rgba(var(--color-primary-rgb, 155, 93, 229), 0.14);
                flex-shrink: 0;
                z-index: 1;
            }
            .nsm-shimmer-bar::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    90deg,
                    rgba(var(--color-text-rgb, 255,255,255), 0)   0%,
                    rgba(var(--color-text-rgb, 255,255,255), 0.2) 50%,
                    rgba(var(--color-text-rgb, 255,255,255), 0)   100%
                );
                background-size: 400px 100%;
                animation: nsmShimmer 1.4s infinite linear;
            }
            .nsm-loading-dots {
                position: absolute;
                bottom: 16px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                gap: 5px;
                z-index: 1;
            }
            .nsm-loading-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: rgba(var(--color-primary-rgb, 155, 93, 229), 0.55);
                animation: nsmDotBounce 1.2s infinite ease-in-out;
            }

            /* ── Filled state ───────────────────────────────────────────────────── */
            .nsm-content-filled {
                position: absolute;
                inset: 0;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justifyContent: center;
                background-size: cover;
                background-position: center;
                overflow: hidden;
            }
            .nsm-content-filled .filled-title {
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
            }

            /* ── Remove button ──────────────────────────────────────────────────── */
            .nsm-remove-content {
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
                justifyContent: center;
                opacity: 0;
                transition: opacity .15s;
                z-index: 3;
            }
            .nsm-content-preview:hover .nsm-remove-content {
                opacity: 1;
            }



            /* ── Drag scrim ─────────────────────────────────────────────────────── */
            body.content-dragging .content-preview-drag-target {
                position: relative;
                z-index: 1400;
                filter: drop-shadow(0 0 18px rgba(var(--color-primary-rgb, 155,93,229),0.5));
            }

            /* ── Dark scrim while picking OR while dragging from drawer ──────────── */
            #contentPickScrim {
                position: fixed;
                inset: 0;
                z-index: 1655;
                background: rgba(0,0,0,0.55);
                pointer-events: none;
                opacity: 0;
                transition: opacity .25s;
            }
            #contentPickScrim.active {
                opacity: 1;
                pointer-events: auto;
            }
            #contentDrawer { z-index: 1700; }

            @media (max-width: 768px) {
                .nsm-remove-content {
                    opacity: 1 !important;
                    background: rgba(0,0,0,0.65) !important;
                    width: 26px !important;
                    height: 26px !important;
                    font-size: 14px !important;
                    top: 8px !important;
                    right: 8px !important;
                }
            }
        `;
}

export const styles: Record<string, CSSProperties> = {};