import React, { useEffect, useRef, useState } from 'react';
import { styles } from './styles';

const EMOJIS = [
  '🎨', '🚀', '✨', '🔥', '💡', 
  '🎯', '🌟', '💫', '🎪', '🎭',
  '🎸', '🎮', '🍕', '🌈', '⚡',
  '🦄', '🎉', '💎', '🏆', '🌺'
];

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  anchorElement: HTMLElement | null;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  anchorElement,
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && anchorElement && pickerRef.current) {
      const iconRect = anchorElement.getBoundingClientRect();
      
      // Force a reflow to get accurate measurements
      const pickerRect = pickerRef.current.getBoundingClientRect();
      const pickerWidth = pickerRect.width || 280; // Use actual width or fallback
      const windowWidth = window.innerWidth;
      
      // Center under icon
      let left = iconRect.left + (iconRect.width / 2) - (pickerWidth / 2);
      
      // Ensure picker doesn't go off left edge
      if (left < 10) {
        left = 10;
      }
      
      // Ensure picker doesn't go off right edge
      if (left + pickerWidth > windowWidth - 10) {
        left = windowWidth - pickerWidth - 10;
      }
      
      setPosition({
        top: iconRect.bottom + 10,
        left,
      });
    }
  }, [isOpen, anchorElement]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div
        ref={pickerRef}
        style={{
          ...styles.picker,
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div style={styles.grid}>
          {EMOJIS.map((emoji) => (
            <div
              key={emoji}
              style={{
                ...styles.option,
                ...(hoveredEmoji === emoji ? styles.optionHover : {}),
              }}
              onClick={() => handleSelect(emoji)}
              onMouseEnter={() => setHoveredEmoji(emoji)}
              onMouseLeave={() => setHoveredEmoji(null)}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EmojiPicker;
