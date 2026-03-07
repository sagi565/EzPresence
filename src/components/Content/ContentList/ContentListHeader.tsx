import React, { useState, useRef, useEffect } from 'react';
import { 
  ListHeader, 
  ListIcon, 
  ListTitleGroup, 
  ListTitleContainer, 
  ListTitle, 
  ListTitleClickable, 
  ListTitleEditable, 
  ListSubtitle, 
  BrandGradient,
  ActionButton
} from './styles';
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
  isEditable,
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
  const iconRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleValue(title);
    setOriginalTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditMode && titleInputRef.current) {
      titleInputRef.current.focus();
      // Place cursor at the end instead of selecting all
      const length = titleInputRef.current.value.length;
      titleInputRef.current.setSelectionRange(length, length);
    }
  }, [isEditMode]);

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
      // Don't enter edit mode for title, just trigger icon click
      setIsIconHovered(false);
      if (iconRef.current) {
        onIconClick(iconRef.current);
      }
    }
  };

  const handleTitleClick = () => {
    if (isEditable && !isEditMode) {
      setIsEditMode(true);
      setIsTitleHovered(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const renderTitle = () => {
    const gradientParts = formatSystemListTitle(title);

    if (gradientParts) {
      return (
        <ListTitle>
          <span style={{ color: '#111827' }}>{gradientParts.prefix}</span>
          <BrandGradient>{gradientParts.gradient}</BrandGradient>
        </ListTitle>
      );
    }

    return <ListTitle>{title}</ListTitle>;
  };

  return (
    <ListHeader ref={containerRef}>
      <ListIcon
        ref={iconRef}
        $isEditable={isEditable}
        $isEditMode={isEditMode}
        $isHovered={isIconHovered}
        onClick={handleIconClick}
        onMouseEnter={() => setIsIconHovered(true)}
        onMouseLeave={() => setIsIconHovered(false)}
      >
        {icon}
      </ListIcon>
      <ListTitleGroup>
        <ListTitleContainer>
          {isEditable ? (
            isEditMode ? (
              <ListTitleEditable
                ref={titleInputRef}
                type="text"
                $isFocused={true}
                value={titleValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitleValue(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                placeholder="My new playlist"
              />
            ) : (
              <ListTitleClickable
                $isHovered={isTitleHovered}
                onClick={handleTitleClick}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
              >
                <ListTitle>{titleValue}</ListTitle>
              </ListTitleClickable>
            )
          ) : (
            renderTitle()
          )}

          {isEditable && isEditMode && (
            <>
              <ActionButton
                $type="save"
                $visible={true}
                $isHovered={isSaveHovered}
                onClick={handleSave}
                onMouseEnter={() => setIsSaveHovered(true)}
                onMouseLeave={() => setIsSaveHovered(false)}
                title="Save changes"
              >
                ✓
              </ActionButton>
              <ActionButton
                $type="delete"
                $visible={true}
                $isHovered={isDeleteHovered}
                onClick={handleDeleteClick}
                onMouseEnter={() => setIsDeleteHovered(true)}
                onMouseLeave={() => setIsDeleteHovered(false)}
                title="Delete list"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </ActionButton>
            </>
          )}
        </ListTitleContainer>
        {subtitle && <ListSubtitle>{subtitle}</ListSubtitle>}
      </ListTitleGroup>
    </ListHeader>
  );
};

export default ContentListHeader;