import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { DropdownMenu, DropdownItemRow, AiBadge } from './styles';

export interface CreateDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: 'post' | 'story' | 'ai') => void;
    /**
     * When provided, the dropdown renders as a fixed portal anchored near this
     * screen position (used for drag-to-date drops).
     * When omitted the dropdown is rendered inline (used inside CreatePostButton).
     */
    anchorPos?: { x: number; y: number };
}

const DROPDOWN_WIDTH = 220;
const DROPDOWN_HEIGHT = 170;

const CreateDropdown: React.FC<CreateDropdownProps> = ({ isOpen, onClose, onSelect, anchorPos }) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    // Freeze the calculated position on first open so re-renders don't jump it.
    // We use a ref so it's stable across renders while the dropdown is open.
    const frozenPos = useRef<{ top: number; left: number } | null>(null);

    if (isOpen && anchorPos && !frozenPos.current) {
        const vw = window.innerWidth;

        // Left side is the mouse (with small 8px padding)
        let left = anchorPos.x + 8;
        if (left + DROPDOWN_WIDTH > vw - 8) left = vw - DROPDOWN_WIDTH - 8;

        // Bottom is the mouse (meaning top is Y minus height)
        let top = anchorPos.y - DROPDOWN_HEIGHT - 8;
        // If it goes off the top edge, flip it below the cursor
        if (top < 8) top = anchorPos.y + 8;

        frozenPos.current = { top, left };
    }

    // Clear the frozen pos when the dropdown closes so next open recalculates.
    useEffect(() => {
        if (!isOpen) {
            frozenPos.current = null;
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    // --- Close on any mousedown outside (both inline and portal modes) ---
    useEffect(() => {
        if (!isOpen) return;
        const onDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        // Small delay so the opening click doesn't immediately close it
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', onDown);
        }, 10);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', onDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const menuContents = (
        <>
            <DropdownItemRow
                $isHovered={hoveredItem === 'single'}
                onClick={() => onSelect('post')}
                onMouseEnter={() => setHoveredItem('single')}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <span>📤</span>
                <span>New Post</span>
            </DropdownItemRow>
            <DropdownItemRow
                $isHovered={hoveredItem === 'story'}
                onClick={() => onSelect('story')}
                onMouseEnter={() => setHoveredItem('story')}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <span>📖</span>
                <span>New Story</span>
            </DropdownItemRow>
            <DropdownItemRow
                $isAi
                onClick={() => onSelect('ai')}
                onMouseEnter={() => setHoveredItem('ai')}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <span>🤖🔁</span>
                <span>AI Series</span>
                <AiBadge>Soon</AiBadge>
            </DropdownItemRow>
        </>
    );

    // --- PORTAL MODE (anchored near a drop position) ---
    if (anchorPos) {
        const pos = frozenPos.current!;

        return ReactDOM.createPortal(
            <DropdownMenu
                ref={ref}
                $isFixed
                $top={pos.top}
                $left={pos.left}
                style={{ minWidth: `${DROPDOWN_WIDTH}px` }}
            >
                {menuContents}
            </DropdownMenu>,
            document.body
        );
    }

    // --- INLINE MODE (used inside CreatePostButton) ---
    return (
        <DropdownMenu ref={ref}>
            {menuContents}
        </DropdownMenu>
    );
};

// Inject the dropdown animation if not already present
const styleId = 'create-dropdown-styles';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
    @keyframes dropdownAppear {
      from { opacity: 0; transform: translateY(-6px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
    document.head.appendChild(style);
}

export default CreateDropdown;
