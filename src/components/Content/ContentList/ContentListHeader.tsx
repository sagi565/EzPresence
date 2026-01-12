import React, { useState, useRef, useEffect } from 'react';
import { styles } from './styles';
import { formatSystemListTitle } from '@models/ContentList';

interface ContentListHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  isSystem: boolean;
  isEditable: boolean;
  listId?: string;
  isNewList?: boolean;
  onTitleChange: (newTitle: string) => void;
  onIconClick: (element: HTMLElement) => void;
  onDelete: () => void;
  onSave?: () => void;
}

const ContentListHeader: React.FC<ContentListHeaderProps> = ({
  icon,
  title,
  subtitle,
  isSystem,
  isEditable,
  listId,
  isNewList = false,
  onTitleChange,
  onIconClick,
  onDelete,
  onSave,
}) => {
  const [isEditMode, setIsEditMode] = useState(isNewList);
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const [originalTitle, setOriginalTitle] = useState(title);
  const iconRef = useRef<HTMLSpanElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update title when prop changes
  useEffect(() => {
    setTitleValue(title);
    setOriginalTitle(title);
  }, [title]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditMode && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditMode]);

  // Handle click outside to exit edit mode
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isEditMode) {
          handleSave();
        }
      }
    };

    if (isEditMode) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditMode, titleValue]);

  const handleSave = () => {
    const value = titleValue.trim();
    if (!value) {
      setTitleValue('My new playlist');
      onTitleChange('My new playlist');
    } else if (value !== originalTitle) {
      onTitleChange(value);
    }
    setOriginalTitle(value || 'My new playlist');
    setIsEditMode(false);
    if (onSave) {
      onSave();
    }
  };

  const handleCancel = () => {
    setTitleValue(originalTitle);
    setIsEditMode(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isEditable) {
      setIsEditMode(true);
      if (iconRef.current) {
        onIconClick(iconRef.current);
      }
    }
  };

  const handleTitleClick = () => {
    if (isEditable && !isEditMode) {
      setIsEditMode(true);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  // Render system list title with gradient
  const renderTitle = () => {
    const gradientParts = formatSystemListTitle(title);
    
    if (gradientParts) {
      return (
        <h2 style={styles.listTitle}>
          <span style={{ color: '#111827' }}>{gradientParts.prefix}</span>
          <span style={styles.brandGradient}>{gradientParts.gradient}</span>
        </h2>
      );
    }
    
    return <h2 style={styles.listTitle}>{title}</h2>;
  };

  const iconStyle = {
    ...styles.listIcon,
    ...(isEditable ? {
      ...styles.listIconEditable,
      ...(isEditMode ? styles.listIconEditMode : {}),
      ...(!isEditMode && isIconHovered ? styles.listIconHover : {}),
    } : {}),
  };

  const titleContainerStyle = {
    ...styles.listTitleClickable,
    ...(isEditable && !isEditMode && isTitleHovered ? styles.listTitleHover : {}),
  };

  const inputStyle = {
    ...styles.listTitleEditable,
    ...(isEditMode ? styles.listTitleEditableFocus : {}),
  };

  const deleteButtonStyle = {
    ...styles.listDeleteBtn,
    ...(isEditMode ? styles.listDeleteBtnVisible : {}),
    ...(isDeleteHovered ? styles.listDeleteBtnHover : {}),
  };

  const saveButtonStyle = {
    ...styles.listSaveBtn,
    ...(isEditMode ? styles.listSaveBtnVisible : {}),
    ...(isSaveHovered ? styles.listSaveBtnHover : {}),
  };

  return (
    <div ref={containerRef} style={styles.listHeader}>
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
            isEditMode ? (
              <input
                ref={titleInputRef}
                type="text"
                style={inputStyle}
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                placeholder="My new playlist"
              />
            ) : (
              <div 
                style={titleContainerStyle}
                onClick={handleTitleClick}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
              >
                <h2 style={styles.listTitleDisplay}>{titleValue}</h2>
              </div>
            )
          ) : (
            renderTitle()
          )}
          
          {isEditable && isEditMode && (
            <>
              <button
                style={saveButtonStyle}
                onClick={handleSave}
                onMouseEnter={() => setIsSaveHovered(true)}
                onMouseLeave={() => setIsSaveHovered(false)}
                title="Save changes"
              >
                ✓
              </button>
              <button
                style={deleteButtonStyle}
                onClick={handleDeleteClick}
                onMouseEnter={() => setIsDeleteHovered(true)}
                onMouseLeave={() => setIsDeleteHovered(false)}
                title="Delete list"
              >
                ×
              </button>
            </>
          )}
        </div>
        {subtitle && <p style={styles.listSubtitle}>{subtitle}</p>}
      </div>
    </div>
  );
};

export default ContentListHeader;