import { CSSProperties } from 'react';

// Exact CSS from HTML demo (Scheduler_Create_Modals.html) for .nsm-content-preview
if (typeof document !== 'undefined') {
    const styleId = 'content-preview-global-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Content preview (9:16) */
            .nsm-content-preview {
                width: 100%;
                aspect-ratio: 9/16;
                border-radius: 14px;
                border: 2px dashed rgba(0, 0, 0, .1);
                background: #f8f9fb;
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                gap: 8px;
                cursor: pointer;
                transition: all .2s;
                overflow: hidden;
                position: relative;
            }
            .nsm-content-preview:hover {
                border-color: #9b5de5;
                background: rgba(155, 93, 229, .04);
            }
            .nsm-content-preview.drop-hover {
                border-color: #9b5de5;
                border-style: solid;
                background: rgba(155, 93, 229, .08);
            }
            /* has-content: no selected ring, just keep normal dashed border */
            .nsm-content-preview.has-content {
                border-style: dashed;
                border-color: rgba(0, 0, 0, .1);
            }
            .nsm-content-placeholder {
                display: flex; flex-direction: column;
                align-items: center; gap: 6px;
                color: #6b7280;
            }
            .nsm-content-placeholder .placeholder-icon {
                font-size: 32px;
                opacity: .7;
            }
            .nsm-content-placeholder .placeholder-text {
                font-size: 11px; font-weight: 500;
                text-align: center;
                padding: 0 8px;
            }
            /* Filled state */
            .nsm-content-filled {
                position: absolute; inset: 0;
                border-radius: 10px;
                display: flex;
                align-items: center; justify-content: center;
                background-size: cover;
                background-position: center;
                overflow: hidden;
            }
            .nsm-content-filled .filled-title {
                position: absolute;
                bottom: 0; left: 0; right: 0;
                font-size: 13px; font-weight: 700;
                color: #fff;
                text-align: center;
                padding: 14px 10px 8px 10px;
                text-shadow: 0 1px 3px rgba(0,0,0,.8);
                background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
                z-index: 2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .nsm-remove-content {
                position: absolute; top: 6px; right: 6px;
                width: 22px; height: 22px;
                border-radius: 50%;
                background: rgba(0,0,0,.5);
                color: #fff;
                border: none;
                font-size: 12px;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                opacity: 0;
                transition: opacity .15s;
                z-index: 3;
            }
            .nsm-content-preview:hover .nsm-remove-content { opacity: 1; }

            /* Pick-elevated state */
            .nsm-content-preview.pick-elevated,
            .npm-content-preview.pick-elevated {
                border-color: #9b5de5;
                background: rgba(155, 93, 229, .04) !important;
                box-shadow: 0 0 0 3px rgba(155, 93, 229, 0.3), 0 8px 32px rgba(155, 93, 229, 0.2);
            }
            .nsm-content-preview.pick-elevated.drop-hover,
            .npm-content-preview.pick-elevated.drop-hover {
                border-style: solid;
                background: rgba(155, 93, 229, .08) !important;
            }

            /*
             * ✅ FIX: Elevate .content-preview-drag-target above the dimmer (z-index 1200)
             * during drag so it remains visible and interactive.
             * Apply class "content-preview-drag-target" to the wrapper div around
             * your <ContentPreview> component(s) in your modal/form.
             */
            body.content-dragging .content-preview-drag-target {
                position: relative;
                z-index: 1400;
                /* Subtle glow so user knows this is the valid drop zone */
                filter: drop-shadow(0 0 18px rgba(155, 93, 229, 0.5));
            }

            /* ── Dark scrim while picking ── */
            #contentPickScrim {
                position: fixed;
                inset: 0;
                z-index: 1655;
                background: rgba(0, 0, 0, 0.55);
                pointer-events: none;
                opacity: 0;
                transition: opacity .25s;
            }
            #contentPickScrim.active {
                opacity: 1;
                pointer-events: auto;
            }
            /* Drawer stays ABOVE the scrim */
            #contentDrawer {
                z-index: 1700;
            }
        `;
        document.head.appendChild(style);
    }
}

export const styles: Record<string, CSSProperties> = {};