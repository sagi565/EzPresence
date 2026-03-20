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
                // Fade back in smoothly
                el.style.visibility = '';
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.2s ease';
                el.style.pointerEvents = '';
                requestAnimationFrame(() => {
                    el.style.opacity = '';
                    setTimeout(() => { el.style.transition = ''; }, 220);
                });
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

        // ── 1. Fade out original smoothly ───────────────────────────────────
        preview.style.transition = 'opacity 0.18s ease';
        preview.style.opacity = '0';
        preview.style.pointerEvents = 'none';
        setTimeout(() => {
            preview.style.visibility = 'hidden';
            preview.style.opacity = '';
            preview.style.transition = '';
        }, 180);

        // ── 2. Inject keyframes (versioned so stale rules never linger) ──────
        const KF_ID = 'pick-halo-keyframes-v2';
        document.getElementById('pick-halo-keyframes')?.remove();
        if (!document.getElementById(KF_ID)) {
            const kf = document.createElement('style');
            kf.id = KF_ID;
            kf.textContent = `
                @keyframes pickGlowBreath {
                    0%, 100% { opacity: 0.7;  }
                    50%       { opacity: 1.0; }
                }
                @keyframes pickGlowIn {
                    from { opacity: 0; }
                    to   { opacity: 0.85; }
                }
                #pickGlow { animation: pickGlowIn 0.4s ease forwards, pickGlowBreath 3s ease-in-out 0.4s infinite; }
            `;
            document.head.appendChild(kf);
        }

        // ── 3. Smooth warm ambient halo — glow outside only ─────────────────
        // The glow sits AROUND the clone, not on top of it.
        // We use box-shadow on a transparent frame so the amber light
        // radiates outward only — nothing bleeds into the drop zone interior.
        const haloPad = 28;
        const haloR   = 22;
        const glow = document.createElement('div');
        glow.id = 'pickGlow';
        glow.style.cssText = `
            position: fixed;
            top:    ${rect.top}px;
            left:   ${rect.left}px;
            width:  ${rect.width}px;
            height: ${rect.height}px;
            z-index: 1658;
            pointer-events: none;
            border-radius: ${haloR}px;
            background: transparent;
            box-shadow:
                0 0  0   1.5px rgba(251,191,36, 0.55),
                0 0  20px 6px  rgba(251,191,36, 0.28),
                0 0  45px 14px rgba(249,115,22, 0.18),
                0 0  80px 24px rgba(251,191,36, 0.09);
        `;
        glow.appendChild((() => {
            // Breathing animation target — just re-applies opacity on #pickGlow itself
            const b = document.createElement('span');
            b.className = 'g-bloom';
            b.style.cssText = 'display:none';
            return b;
        })());

        document.body.appendChild(glow);
        pickGlowRef.current = glow;

        // ── 4. Dark scrim ────────────────────────────────────────────────────
        let scrim = document.getElementById('contentPickScrim') as HTMLElement | null;
        if (!scrim) {
            scrim = document.createElement('div');
            scrim.id = 'contentPickScrim';
            document.body.appendChild(scrim);
        }
        requestAnimationFrame(() => scrim!.classList.add('active'));
        pickScrimRef.current = scrim;

        // ── 5. Visual clone — shows "Drop here" immediately, content visible beneath ──
        // Clone the real preview DOM so content is preserved underneath
        const clone = preview.cloneNode(true) as HTMLElement;
        clone.id = 'pickClone';
        clone.removeAttribute('onclick');
        clone.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            z-index: 1660;
            pointer-events: auto;
            border-radius: ${haloR}px;
            border: none;
            overflow: hidden;
            transition: box-shadow 0.15s ease;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        `;

        // Disable pointer events on all children so drag events land on clone only
        clone.querySelectorAll('*').forEach((el: any) => {
            el.style.pointerEvents = 'none';
        });

        // "Drop here" overlay — visible immediately (user clicked, not dragging yet)
        const dropOverlay = document.createElement('div');
        dropOverlay.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.2s ease, background 0.2s ease;
            background: rgba(0,0,0,0.52);
            backdrop-filter: blur(3px);
            -webkit-backdrop-filter: blur(3px);
        `;
        dropOverlay.innerHTML = `
            <div style="
                width: 44px; height: 44px;
                border-radius: 50%;
                border: 2px solid rgba(251,191,36,0.8);
                display: flex; align-items: center; justify-content: center;
                font-size: 20px;
            ">🎞️</div>
            <div style="
                font-size: 11px;
                font-weight: 700;
                color: rgba(255,255,255,0.9);
                letter-spacing: 0.08em;
                text-transform: uppercase;
            ">Drop here</div>
        `;
        clone.appendChild(dropOverlay);

        // dragover — content still visible, overlay intensifies
        clone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer!.dropEffect = 'copy';
            dropOverlay.style.background = 'rgba(0,0,0,0.65)';
            clone.style.boxShadow = '0 0 0 2px rgba(251,191,36,0.9), 0 12px 40px rgba(251,191,36,0.25)';
        });

        // dragleave — back to default overlay state
        clone.addEventListener('dragleave', (e) => {
            if (e.relatedTarget && clone.contains(e.relatedTarget as Node)) return;
            dropOverlay.style.background = 'rgba(0,0,0,0.52)';
            clone.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
        });

        // drop — confirm flash then pick
        clone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropOverlay.style.background = 'rgba(0,0,0,0.7)';
            dropOverlay.innerHTML = `
                <div style="
                    width: 44px; height: 44px;
                    border-radius: 50%;
                    background: rgba(251,191,36,0.2);
                    border: 2px solid rgba(251,191,36,1);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px; color: white;
                ">✓</div>
            `;
            let item = null;
            try {
                const itemData = e.dataTransfer!.getData('item');
                if (itemData) item = JSON.parse(itemData);
            } catch (_) { }
            setTimeout(() => {
                if (item) { cleanup(); onPick(item); }
            }, 150);
        });

        document.body.appendChild(clone);
        pickCloneRef.current = clone;

        // ── 6. Activate overlay & open drawer in picking mode ────────────────
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