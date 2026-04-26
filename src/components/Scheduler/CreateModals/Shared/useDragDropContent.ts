import React, { useState, useRef, useEffect } from 'react';
import { ContentItem } from '@/models/ContentList';

export const useDragDropContent = (
    content: ContentItem[],
    onContentSelect: (content: ContentItem) => void,
    cancelPicking: () => void,
    onContentDrop?: () => void
) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const dragCounter = useRef(0);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current += 1;
        if (dragCounter.current === 1) setIsDragOver(true);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (_e: React.DragEvent) => {
        dragCounter.current -= 1;
        if (dragCounter.current <= 0) {
            dragCounter.current = 0;
            setIsDragOver(false);
        }
    };

    const handleManualDrop = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current = 0;
        setIsDragOver(false);
        const contentId = e.dataTransfer.getData('contentId');
        if (contentId) {
            const droppedContent = content.find(c => c.id === contentId);
            if (droppedContent) {
                onContentSelect(droppedContent);
                cancelPicking(); // Ensure picking state and scrim are cleaned up
                if (onContentDrop) onContentDrop();
            }
        }
    };

    // Reset counter when drag ends anywhere on page
    useEffect(() => {
        const reset = () => {
            dragCounter.current = 0;
            setIsDragOver(false);
        };
        window.addEventListener('dragend', reset);
        return () => window.removeEventListener('dragend', reset);
    }, []);

    return {
        isDragOver,
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleManualDrop
    };
};
