import { useCallback, useRef, useEffect, useState } from 'react';

interface UseContentPickingProps {
    onPick: (item: any) => void;
    targetType: 'post' | 'story';
}

/**
 * useContentPicking — matches the HTML demo (Scheduler_Create_Modals.html) exactly.
 *
 * When startPicking() is called:
 * 1. The original content preview is hidden (visibility: hidden).
 * 2. A yellow radial glow div is appended to <body> behind the clone.
 * 3. A clone of the preview is appended to <body> at the exact same screen position,
 *    above the dark overlay (z-index 1660). The clone is the drop target.
 * 4. The content-pick overlay becomes active and the drawer opens in picking mode.
 *
 * On drop: onPick(item) is called and everything is cleaned up.
 * On cancel: cleanup only.
 */
export const useContentPicking = ({ onPick, targetType }: UseContentPickingProps) => {
    const previewId = targetType === 'story' ? 'nsmContentPreview' : 'npmContentPreview';

    const pickCloneRef = useRef<HTMLElement | null>(null);
    const pickGlowRef = useRef<HTMLElement | null>(null);
    const pickScrimRef = useRef<HTMLElement | null>(null);
    const [isPicking, setIsPicking] = useState(false);

    // Shared cleanup — remove clone, glow, restore original, clear overlay/drawer classes
    const cleanup = useCallback(() => {
        setIsPicking(false);

        if (pickCloneRef.current) {
            pickCloneRef.current.remove();
            pickCloneRef.current = null;
        }
        if (pickGlowRef.current) {
            pickGlowRef.current.remove();
            pickGlowRef.current = null;
        }
        if (pickScrimRef.current) {
            pickScrimRef.current.classList.remove('active');
            // short fade-out then remove
            const s = pickScrimRef.current;
            setTimeout(() => s.remove(), 280);
            pickScrimRef.current = null;
        }

        // Restore originals for both modals (in case both are in DOM)
        ['nsmContentPreview', 'npmContentPreview'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.visibility = '';
                el.classList.remove('pick-elevated');
            }
        });

        document.getElementById('contentPickOverlay')?.classList.remove('active');
        document.getElementById('contentDrawer')?.classList.remove('nsm-picking');
        document.getElementById('contentDrawer')?.classList.remove('npm-picking');
    }, []);

    useEffect(() => {
        const handlePickEvent = () => cleanup();
        window.addEventListener('pick-content', handlePickEvent);
        window.addEventListener('cancel-pick-content', handlePickEvent);

        return () => {
            cleanup();
            window.removeEventListener('pick-content', handlePickEvent);
            window.removeEventListener('cancel-pick-content', handlePickEvent);
        };
    }, [cleanup]);

    const startPicking = useCallback(() => {
        setIsPicking(true);

        const preview = document.getElementById(previewId);
        if (!preview) {
            console.warn(`Preview element #${previewId} not found`);
            return;
        }

        const rect = preview.getBoundingClientRect();

        // These constants match the HTML demo exactly
        const CLONE_BG = '#f8f7fc';
        const CLONE_BG_HOVER = '#f0ecf7';

        // ── 1. Hide original ────────────────────────────────────────────────
        preview.style.visibility = 'hidden';

        // ── 2. Yellow glow (matches demo's rgba(251, 191, 36) glow) ─────────
        const glowPad = 28;
        const glow = document.createElement('div');
        glow.id = 'pickGlow';
        glow.style.cssText = `
            position: fixed;
            top: ${rect.top - glowPad}px;
            left: ${rect.left - glowPad}px;
            width: ${rect.width + glowPad * 2}px;
            height: ${rect.height + glowPad * 2}px;
            z-index: 1659;
            pointer-events: none;
            border-radius: ${14 + glowPad}px;
            background: radial-gradient(ellipse at center,
                rgba(251, 191, 36, .45) 0%,
                rgba(251, 191, 36, .25) 40%,
                rgba(251, 191, 36, .08) 70%,
                transparent 100%);
        `;
        document.body.appendChild(glow);
        pickGlowRef.current = glow;

        // ── 2b. Dark scrim (dims everything behind clone/drawer) ─────────────
        let scrim = document.getElementById('contentPickScrim') as HTMLElement | null;
        if (!scrim) {
            scrim = document.createElement('div');
            scrim.id = 'contentPickScrim';
            document.body.appendChild(scrim);
        }
        // trigger fade-in on next frame
        requestAnimationFrame(() => scrim!.classList.add('active'));
        pickScrimRef.current = scrim;

        // ── 3. Visual clone (the actual drop zone) ───────────────────────────
        const clone = preview.cloneNode(true) as HTMLElement;
        clone.id = 'pickClone';
        clone.removeAttribute('onclick');
        // Style matches the HTML demo clone setup exactly
        clone.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            z-index: 1660;
            pointer-events: auto;
            margin: 0;
            border-color: #9b5de5;
            background: ${CLONE_BG};
            border-radius: 14px;
            border-width: 2px;
            border-style: dashed;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            overflow: hidden;
        `;

        // Prevent children from stealing drag events (causes flickering)
        clone.querySelectorAll('*').forEach((child: any) => {
            child.style.pointerEvents = 'none';
        });

        // dragover → solid border + deeper bg (matches demo)
        clone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer!.dropEffect = 'copy';
            clone.style.borderStyle = 'solid';
            clone.style.background = CLONE_BG_HOVER;
        });

        // dragleave → revert to dashed (matches demo)
        clone.addEventListener('dragleave', (e) => {
            e.stopPropagation();
            if (e.relatedTarget && clone.contains(e.relatedTarget as Node)) return;
            clone.style.borderStyle = 'dashed';
            clone.style.background = CLONE_BG;
        });

        // drop → parse item data and call onPick (matches demo)
        clone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let item = null;
            try {
                const itemData = e.dataTransfer!.getData('item');
                if (itemData) item = JSON.parse(itemData);
            } catch (_) { }

            if (item) {
                cleanup();
                onPick(item);
            }
        });

        document.body.appendChild(clone);
        pickCloneRef.current = clone;

        // ── 4. Activate overlay & open drawer in picking mode ────────────────
        document.getElementById('contentPickOverlay')?.classList.add('active');
        const drawer = document.getElementById('contentDrawer');
        if (drawer) {
            drawer.classList.add('nsm-picking');
            drawer.classList.add('open');
        }
    }, [previewId, cleanup, onPick]);

    const cancelPicking = useCallback(() => {
        cleanup();
        document.getElementById('contentDrawer')?.classList.remove('open');
    }, [cleanup]);

    return { startPicking, cancelPicking, isPicking };
};
