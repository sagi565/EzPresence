import React, { useState, useRef, useEffect } from 'react';
import { styles } from './styles';
import { theme } from '@theme/theme';

interface CreatePostButtonProps {
  onCreateStory?: () => void;
  onCreatePost?: () => void;
}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onCreateStory, onCreatePost }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const handleCreatePost = (type: string) => {
    if (type === 'story') {
      onCreateStory?.();
      setShowDropdown(false);
      return;
    }

    if (type === 'single') {
      onCreatePost?.();
      setShowDropdown(false);
      return;
    }

    const message =
      type === 'ai'
        ? 'AI Series feature coming soon!'
        : `Creating ${type} post...`;
    alert(message);
    setShowDropdown(false);
  };

  const buttonStyle = {
    ...styles.createBtn,
    ...(hoveredBtn ? {
      transform: 'scale(1.07)',
      boxShadow: '0 6px 20px rgba(251, 191, 36, 0.4)',
    } : {}),
  };

  const dropdownItemStyle = (itemId: string) => ({
    ...styles.dropdownItem,
    ...(hoveredItem === itemId ? {
      background: theme.gradients.balance,
      color: 'white',
    } : {}),
  });

  return (
    <div ref={dropdownRef} style={styles.createButton}>
      <button
        style={buttonStyle}
        onClick={() => setShowDropdown(!showDropdown)}
        onMouseEnter={() => setHoveredBtn(true)}
        onMouseLeave={() => setHoveredBtn(false)}
      >
        Create
      </button>
      {showDropdown && (
        <div style={styles.createDropdown}>
          <div
            style={dropdownItemStyle('single')}
            onClick={() => handleCreatePost('single')}
            onMouseEnter={() => setHoveredItem('single')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span>📤</span>
            <div style={styles.optionInfo}>
              <span style={styles.optionLabel}>New Post</span>
              <span style={styles.optionDesc}>Schedule a post for feed</span>
            </div>
          </div>
          <div
            style={dropdownItemStyle('story')}
            onClick={() => handleCreatePost('story')}
            onMouseEnter={() => setHoveredItem('story')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span>📖</span>
            <span>New Story</span>
          </div>
          <div
            style={{
              ...dropdownItemStyle('ai'),
              opacity: 0.6,
              cursor: 'default',
              position: 'relative' as const,
            }}
            onClick={() => handleCreatePost('ai')}
            onMouseEnter={() => setHoveredItem('ai')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span>🤖🔁</span>
            <span>AI Series</span>
            <span style={{
              fontSize: '9px',
              fontWeight: 700,
              color: theme.colors.secondary,
              background: 'rgba(251, 191, 36, 0.15)',
              padding: '2px 6px',
              borderRadius: '4px',
              marginLeft: 'auto',
            }}>
              SOON
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostButton;