import React, { useState, useRef } from 'react';
import { styles } from './styles';

interface ContentListHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  isSystem: boolean;
  isEditable: boolean;
  listId?: string;
  onTitleChange: (newTitle: string) => void;
  onIconClick: (element: HTMLElement) => void;
  onDelete: () => void;
}

const ContentListHeader: React.FC<ContentListHeaderProps> = ({
  icon,
  title,
  subtitle,
  isSystem,
  isEditable,
  listId,
  onTitleChange,
  onIconClick,
  onDelete,
}) => {
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTitleFocused(false);
    const value = e.target.value.trim();
    if (!value) {
      setTitleValue('My new playlist');
      onTitleChange('My new playlist');
    } else {
      onTitleChange(value);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isEditable && iconRef.current) {
      onIconClick(iconRef.current);
    }
  };

  const iconStyle = {
    ...styles.listIcon,
    ...(isEditable ? {
      ...styles.listIconEditable,
      ...(isIconHovered && !isTitleFocused ? styles.listIconHover : {}),
      ...(isTitleFocused ? styles.listIconFocused : {}),
      ...(isTitleFocused && isIconHovered ? styles.listIconFocusedHover : {}),
    } : {}),
  };
  const deleteButtonStyle = {
    ...styles.listDeleteBtn,
    ...(isTitleFocused ? styles.listDeleteBtnVisible : {}),
    ...(isDeleteHovered ? styles.listDeleteBtnHover : {}),
  };

  const inputStyle = {
    ...styles.listTitleEditable,
    ...(isTitleFocused ? styles.listTitleEditableFocus : {}),
  };

  return (
    <div style={styles.listHeader}>
      <span
        ref={iconRef}
        className="list-icon"
        style={iconStyle}
        onClick={handleIconClick}
        onMouseEnter={() => setIsIconHovered(true)}
        onMouseLeave={() => setIsIconHovered(false)}
      >
        {icon}
      </span>
      <div style={styles.listTitleGroup}>
        <div style={styles.listTitleContainer}>
          {isEditable ? (
            <input
              type="text"
              style={inputStyle}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onFocus={() => setIsTitleFocused(true)}
              onBlur={handleTitleBlur}
              onKeyPress={handleTitleKeyPress}
              placeholder="My new playlist"
            />
          ) : (
            <h2 style={styles.listTitle}>
              {title.includes('Creators') || title.includes('Producer') ? (
                <>
                  {title.split(' ').slice(0, 2).join(' ')}{' '}
                  <span style={styles.brandGradient}>
                    {title.split(' ').slice(2).join(' ')}
                  </span>
                </>
              ) : (
                title
              )}
            </h2>
          )}
          {!isSystem && (
            <button
              style={deleteButtonStyle}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this list and remove all its content?')) {
                  onDelete();
                }
              }}
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
              title="Delete list"
            >
              ×
            </button>
          )}
        </div>
        {subtitle && <p style={styles.listSubtitle}>{subtitle}</p>}
      </div>
    </div>
  );
};

export default ContentListHeader;