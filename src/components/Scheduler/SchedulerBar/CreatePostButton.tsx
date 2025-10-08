import React, { useState, useRef, useEffect } from 'react';
import { styles } from './styles';
import { theme } from '@theme/theme';

const CreatePostButton: React.FC = () => {
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
      background: theme.gradients.vibe,
      transform: 'translateY(-2px)',
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
            <span>Single Post</span>
          </div>
          <div
            style={dropdownItemStyle('repeat')}
            onClick={() => handleCreatePost('repeat')}
            onMouseEnter={() => setHoveredItem('repeat')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span>🔁</span>
            <span>Repeat Post</span>
          </div>
          <div
            style={dropdownItemStyle('ai')}
            onClick={() => handleCreatePost('ai')}
            onMouseEnter={() => setHoveredItem('ai')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span>🤖🔁</span>
            <span>AI Series</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostButton;