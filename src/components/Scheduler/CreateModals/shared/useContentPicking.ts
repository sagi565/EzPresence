import { useState, useCallback, useRef } from 'react';

interface UseContentPickingProps {
    contentPreviewRef: React.RefObject<HTMLDivElement>;
    onCancel: () => void;
    onPick: (item: any) => void;
}

export const useContentPicking = ({ contentPreviewRef, onCancel, onPick }: UseContentPickingProps) => {
    const [isPicking, setIsPicking] = useState(false);
    const cloneRef = useRef<HTMLElement | null>(null);
    const glowRef = useRef<HTMLElement | null>(null);

    const cleanup = useCallback(() => {
        if (cloneRef.current) {
            cloneRef.current.remove();
            cloneRef.current = null;
        }
        if (glowRef.current) {
            glowRef.current.remove();
            glowRef.current = null;
        }
        if (contentPreviewRef.current) {
            contentPreviewRef.current.style.visibility = '';
            contentPreviewRef.current.classList.remove('pick-elevated');
        }
        setIsPicking(false);
    }, [contentPreviewRef]);

    const cancelPicking = useCallback(() => {
        cleanup();
        onCancel();
    }, [cleanup, onCancel]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        let item = null;
        try {
            const itemData = e.dataTransfer.getData('item');
            if (itemData) {
                item = JSON.parse(itemData);
            }
        } catch (err) {
            console.error('Failed to parse dropped item:', err);
        }

        if (item) {
            cleanup();
            onPick(item);
        }
    }, [cleanup, onPick]);

    const startPicking = useCallback(() => {
        if (!contentPreviewRef.current) return;

        setIsPicking(true);
        const rect = contentPreviewRef.current.getBoundingClientRect();
        const CLONE_BG = '#f8f7fc';
        const CLONE_BG_HOVER = '#f0ecf7';

        // Hide original
        contentPreviewRef.current.style.visibility = 'hidden';

        // Create Glow
        const glowPad = 28;
        const glow = document.createElement('div');
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
        glowRef.current = glow;

        // Create Clone
        const clone = contentPreviewRef.current.cloneNode(true) as HTMLElement;
        clone.id = 'pickClone';
        clone.removeAttribute('onclick'); // prevent click handlers
        clone.style.cssText = `
      position: fixed;
      top: ${rect.top}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      z-index: 1660;
      pointer-events: auto;
      margin: 0;
      border-color: var(--color-primary);
      background: ${CLONE_BG};
      border-radius: 14px;
      border-width: 2px;
      border-style: dashed;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      overflow: hidden;
    `;

        // Prevent children from stealing drag events
        clone.querySelectorAll('*').forEach((child: any) => {
            child.style.pointerEvents = 'none';
        });

        // Add Drag Listeners to Clone
        clone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer!.dropEffect = 'copy';
            clone.style.borderStyle = 'solid';
            clone.style.background = CLONE_BG_HOVER;
        });

        clone.addEventListener('dragleave', (e) => {
            e.stopPropagation();
            // Only revert if cursor truly left the clone
            if (e.relatedTarget && clone.contains(e.relatedTarget as Node)) return;
            clone.style.borderStyle = 'dashed';
            clone.style.background = CLONE_BG;
        });

        clone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let item = null;
            try {
                const itemData = e.dataTransfer!.getData('item');
                if (itemData) {
                    item = JSON.parse(itemData);
                }
            } catch (err) { }

            if (item) {
                cleanup();
                onPick(item);
            }
        });

        document.body.appendChild(clone);
        cloneRef.current = clone;

    }, [contentPreviewRef, cleanup, onPick]);

    // Handle overlay drag events (proxy to clone logic if needed, or just visual feedback)
    const handleOverlayDragOver = useCallback((e: React.DragEvent) => {
        if (!isPicking || !cloneRef.current) return;
        // Detailed geometry check could go here if needed, but the clone's own listeners usually handle direct interaction
    }, [isPicking]);

    const handleOverlayDrop = useCallback((e: React.DragEvent) => {
        if (!isPicking || !cloneRef.current) return;
        const rect = cloneRef.current.getBoundingClientRect();
        const isOnClone = e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom;

        if (isOnClone) {
            handleDrop(e);
        }
    }, [isPicking, handleDrop]);


    return {
        isPicking,
        startPicking,
        cancelPicking,
        handleOverlayDragOver, // Optional: if we want the main overlay to help guide drops
        handleOverlayDrop      // Optional
    };
};
