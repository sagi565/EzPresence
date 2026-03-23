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

    // Removed clone and glow refs; we now use the native preview element
    const pickScrimRef = useRef<HTMLElement | null>(null);
    const [isPicking, setIsPicking] = useState(false);

    // Shared cleanup — remove clone, glow, restore original, clear overlay/drawer classes
    const cleanup = useCallback(() => {
        setIsPicking(false);


        if (pickScrimRef.current) {
            pickScrimRef.current.classList.remove('active');
            // short fade-out then remove
            const s = pickScrimRef.current;
            setTimeout(() => s.remove(), 280);
            pickScrimRef.current = null;
        }

        document.body.classList.remove('content-picking');

        // Restore originals for both modals (in case both are in DOM)
        ['nsmContentPreview', 'npmContentPreview'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('is-picking');
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

        // ── 1. Elevate Original Preview ─────────────────────────────────────
        preview.classList.add('is-picking');

        // ── 2. Dark scrim (dims everything behind elevated preview/drawer) ──
        document.body.classList.add('content-picking');

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
