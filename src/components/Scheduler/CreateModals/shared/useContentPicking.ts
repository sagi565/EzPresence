import { useCallback, useRef, useEffect } from 'react';
import { getDragItem } from '@/utils/dragState';

interface UseContentPickingProps {
    onPick: (item: any) => void;
    targetType: 'post' | 'story';
}

export const useContentPicking = ({ onPick, targetType }: UseContentPickingProps) => {
    // We need to know which ID to look for based on targetType
    const previewId = targetType === 'story' ? 'nsmContentPreview' : 'npmContentPreview';

    // Refs to keep track of created elements to clean them up
    const pickCloneRef = useRef<HTMLElement | null>(null);
    const pickGlowRef = useRef<HTMLElement | null>(null);

    const cleanup = useCallback(() => {
        // 1. Remove Clone
        if (pickCloneRef.current) {
            pickCloneRef.current.remove();
            pickCloneRef.current = null;
        }
        // 2. Remove Glow
        if (pickGlowRef.current) {
            pickGlowRef.current.remove();
            pickGlowRef.current = null;
        }

        // 3. Restore Original visibility
        const original = document.getElementById(previewId);
        if (original) {
            original.style.visibility = '';
            original.classList.remove('pick-elevated');
        }

        // 4. Reset Overlay & Drawer classes
        document.getElementById('contentPickOverlay')?.classList.remove('active');
        document.getElementById('contentDrawer')?.classList.remove('nsm-picking');
        // Note: We don't close the drawer here automatically on cleanup unless we want to, 
        // but the HTML demo does: document.getElementById('contentDrawer').classList.remove('open');
        // For now we'll stick to removing the picking class.
    }, [previewId]);

    // Cleanup on unmount AND on global pick event (for double-click support)
    useEffect(() => {
        const handlePickEvent = () => cleanup();
        window.addEventListener('pick-content', handlePickEvent);

        return () => {
            cleanup();
            window.removeEventListener('pick-content', handlePickEvent);
        };
    }, [cleanup]);

    const startPicking = useCallback(() => {
        const preview = document.getElementById(previewId);
        if (!preview) {
            console.warn(`Preview element #${previewId} not found`);
            return;
        }

        const rect = preview.getBoundingClientRect();
        const CLONE_BG = '#f8f7fc';
        const CLONE_BG_HOVER = '#f0ecf7';

        // 1. Hide the original
        preview.style.visibility = 'hidden';

        // 2. Create Glow Element (Behind Clone)
        const glowPad = 40; // Increased padding for smoother falloff
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
        border-radius: ${20 + glowPad}px;
        filter: blur(20px);
        background: radial-gradient(ellipse at center,
            rgba(155, 93, 229, 0.15) 0%,
            rgba(155, 93, 229, 0.05) 40%,
            transparent 70%);
        transition: all 0.3s ease;
    `;
        document.body.appendChild(glow);
        pickGlowRef.current = glow;

        // 3. Create Visual Clone (The Drop Zone)
        const clone = preview.cloneNode(true) as HTMLElement;
        clone.id = 'pickClone';
        clone.removeAttribute('onclick');
        // Force specific styles to match the demo exactly
        clone.style.cssText = `
        position: fixed;
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        z-index: 1660;
        pointer-events: auto;
        margin: 0;
        border: 2px solid rgba(155, 93, 229, 0.4);
        background: ${CLONE_BG};
        border-radius: 16px;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        overflow: hidden;
        transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        background-size: cover;
        background-position: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    `;

        // Prevent children from stealing drag events
        clone.querySelectorAll('*').forEach((child: any) => {
            child.style.pointerEvents = 'none';
        });

        // Hover Effect when mouse on it (not dragging)
        clone.addEventListener('mouseenter', () => {
            if (!hasPreview) {
                clone.style.borderColor = 'rgba(155, 93, 229, 0.6)';
                clone.style.background = CLONE_BG_HOVER;
                clone.style.transform = 'translateY(-2px) scale(1.01)';
                clone.style.boxShadow = '0 8px 30px rgba(155, 93, 229, 0.15)';
                if (pickGlowRef.current) {
                    pickGlowRef.current.style.opacity = '1';
                    pickGlowRef.current.style.transform = 'scale(1.1)';
                }
            }
        });

        clone.addEventListener('mouseleave', () => {
            if (!hasPreview) {
                clone.style.borderColor = 'rgba(155, 93, 229, 0.3)';
                clone.style.background = CLONE_BG;
                clone.style.transform = 'translateY(0) scale(1)';
                clone.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                if (pickGlowRef.current) {
                    pickGlowRef.current.style.opacity = '0.8';
                    pickGlowRef.current.style.transform = 'scale(1)';
                }
            }
        });

        // Track preview state
        let hasPreview = false;

        // Add Drag Listeners to Clone
        clone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer!.dropEffect = 'copy';

            const draggedItem = getDragItem();

            // Visual feedback
            clone.style.borderStyle = 'solid';
            clone.style.borderColor = 'var(--color-primary)';
            clone.style.boxShadow = '0 0 0 4px rgba(155, 93, 229, 0.1)';
            clone.style.transform = 'scale(1.02)';

            if (draggedItem && !hasPreview) {
                hasPreview = true;

                // Hide internal placeholders
                Array.from(clone.children).forEach((child: any) => {
                    child.style.opacity = '0';
                });

                if (draggedItem.thumbnail) {
                    // Nice UX: Gradient overlay + Thumbnail
                    clone.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.2)), url(${draggedItem.thumbnail})`;
                    clone.style.backgroundColor = '#f3f4f6'; // Light gray fallback instead of stark white
                    clone.style.backgroundSize = 'cover';
                    clone.style.backgroundPosition = 'center';
                }

                // Video Preview
                if (draggedItem.type === 'video' && draggedItem.filePath) {
                    const vid = document.createElement('video');
                    vid.src = draggedItem.filePath;
                    vid.muted = true;
                    vid.loop = true;
                    vid.autoplay = true;
                    vid.style.cssText = `
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: 10;
                    pointer-events: none;
                 `;
                    clone.appendChild(vid);
                }
            } else if (!draggedItem) {
                clone.style.background = CLONE_BG_HOVER;
            }
        });

        clone.addEventListener('dragleave', (e) => {
            e.stopPropagation();
            // Only revert if cursor truly left the clone
            if (e.relatedTarget && clone.contains(e.relatedTarget as Node)) return;

            hasPreview = false;

            // Remove video
            const vids = clone.querySelectorAll('video');
            vids.forEach(v => v.remove());

            clone.style.borderStyle = 'dashed';
            clone.style.borderColor = 'rgba(155, 93, 229, 0.3)';
            clone.style.background = CLONE_BG;
            clone.style.backgroundImage = 'none';
            clone.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
            clone.style.transform = 'scale(1)';

            // Restore children
            Array.from(clone.children).forEach((child: any) => {
                child.style.opacity = '1';
            });
        });

        clone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clone.style.transform = 'scale(1)';

            let item = null;
            try {
                const itemData = e.dataTransfer!.getData('item');
                if (itemData) item = JSON.parse(itemData);
            } catch (err) { }

            if (item) {
                cleanup();
                onPick(item);
            }
        });

        document.body.appendChild(clone);
        pickCloneRef.current = clone;

        // 4. Activate Overlay & Drawer
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

    return { startPicking, cancelPicking };
};
