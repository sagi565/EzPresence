import React, { useEffect, useRef, useState } from 'react';
import { 
  PickerContainer, 
  EmojiGrid, 
  EmojiOption 
} from './styles';

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
      const pickerRect = pickerRef.current.getBoundingClientRect();
      const pickerWidth = pickerRect.width || 280;
      const windowWidth = window.innerWidth;

      let left = iconRect.left + (iconRect.width / 2) - (pickerWidth / 2);

      if (left < 10) {
        left = 10;
      }

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
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        (!anchorElement || !anchorElement.contains(e.target as Node))
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorElement]);

  if (!isOpen) return null;

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  return (
    <PickerContainer
      ref={pickerRef}
      $top={position.top}
      $left={position.left}
    >
      <EmojiGrid>
        {EMOJIS.map((emoji) => (
          <EmojiOption
            key={emoji}
            $isHovered={hoveredEmoji === emoji}
            onClick={() => handleSelect(emoji)}
            onMouseEnter={() => setHoveredEmoji(emoji)}
            onMouseLeave={() => setHoveredEmoji(null)}
          >
            {emoji}
          </EmojiOption>
        ))}
      </EmojiGrid>
    </PickerContainer>
  );
};

export default EmojiPicker;
