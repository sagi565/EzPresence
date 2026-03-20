import { CSSProperties } from 'react';

if (typeof document !== 'undefined') {
    const styleId = 'content-preview-global-styles-v5';
    // Remove any old version so the new rules always win
    ['content-preview-global-styles', 'content-preview-global-styles-v2',
     'content-preview-global-styles-v3', 'content-preview-global-styles-v4']
        .forEach(id => document.getElementById(id)?.remove());
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
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
                from { opacity: 0; transform: scale(0.97); }
                to   { opacity: 1; transform: scale(1);    }
            }

            /* ── Base preview shell ─────────────────────────────────────────────── */
            .nsm-content-preview {
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
            }

            /* Empty — subtle border hint on hover, no background change */
            .nsm-content-preview:not(.has-content):hover {
                border-color: rgba(155, 93, 229, 0.4);
            }

            /* Drop-target highlight */
            .nsm-content-preview.drop-hover {
                border-color: #9b5de5 !important;
                border-style: solid !important;
                background: rgba(155, 93, 229, .08) !important;
            }

            /* Has content — zero border, zero background, clean slate */
            .nsm-content-preview.has-content {
                border: none !important;
                border-width: 0 !important;
                outline: none !important;
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
                color: #6b7280;
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
                background: linear-gradient(135deg, #f0ebfa 0%, #f8f5fd 50%, #f0ebfa 100%);
                overflow: hidden;
            }
            /* The travelling shimmer sweep */
            .nsm-content-loading::before {
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
                animation: nsmShimmer 1.4s infinite linear;
            }
            .nsm-shimmer-bar {
                position: relative;
                overflow: hidden;
                background: rgba(155, 93, 229, 0.14);
                flex-shrink: 0;
                z-index: 1;
            }
            .nsm-shimmer-bar::after {
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
                background: rgba(155, 93, 229, 0.55);
                animation: nsmDotBounce 1.2s infinite ease-in-out;
            }

            /* ── Filled state ───────────────────────────────────────────────────── */
            .nsm-content-filled {
                position: absolute;
                inset: 0;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
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
                justify-content: center;
                opacity: 0;
                transition: opacity .15s;
                z-index: 3;
            }
            .nsm-content-preview:hover .nsm-remove-content {
                opacity: 1;
            }

            /* ── Pick-elevated state ────────────────────────────────────────────── */
            .nsm-content-preview.pick-elevated {
                border: 2px dashed #9b5de5 !important;
                background: rgba(155, 93, 229, .04) !important;
                box-shadow: 0 0 0 3px rgba(155,93,229,0.25), 0 8px 32px rgba(155,93,229,0.2);
            }

            /* ── Drag scrim ─────────────────────────────────────────────────────── */
            body.content-dragging .content-preview-drag-target {
                position: relative;
                z-index: 1400;
                filter: drop-shadow(0 0 18px rgba(155,93,229,0.5));
            }

            /* ── Dark scrim while picking ───────────────────────────────────────── */
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
        `;
        document.head.appendChild(style);
    }
}

export const styles: Record<string, CSSProperties> = {};