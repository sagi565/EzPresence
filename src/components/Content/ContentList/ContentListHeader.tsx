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
  PrefixText,
  BrandGradient,
  AddContentButton
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
  isMobile?: boolean;
  onTitleChange: (newTitle: string) => void;
  onIconClick: (element: HTMLElement) => void;
  onSave?: () => void;
  onUpload: (file: File) => void;
  onAddNavigate?: () => void;
  listType: 'video' | 'image';
  acceptBoth?: boolean;
}

const ContentListHeader: React.FC<ContentListHeaderProps> = ({
  icon,
  title,
  subtitle,
  isEditable,
  isNewList = false,
  onTitleChange,
  onIconClick,
  onSave,
  onUpload,
  onAddNavigate,
  listType,
  acceptBoth,
  isMobile,
}) => {
  const [isEditMode, setIsEditMode] = useState(isNewList);
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const [originalTitle, setOriginalTitle] = useState(title);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddClick = () => {
    if (onAddNavigate) {
      onAddNavigate();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderTitle = () => {
    const gradientParts = formatSystemListTitle(title);

    if (gradientParts) {
      return (
        <ListTitle $isMobile={isMobile}>
          <PrefixText>{gradientParts.prefix}</PrefixText>
          <BrandGradient>{gradientParts.gradient}</BrandGradient>
        </ListTitle>
      );
    }

    return <ListTitle $isMobile={isMobile}>{title}</ListTitle>;
  };

  return (
    <ListHeader ref={containerRef} $isMobile={isMobile}>
      <ListIcon
        ref={iconRef}
        $isEditable={isEditable}
        $isEditMode={isEditMode}
        $isHovered={isIconHovered}
        $isMobile={isMobile}
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
                $isMobile={isMobile}
              />
            ) : (
              <ListTitleClickable
                $isHovered={isTitleHovered}
                onClick={handleTitleClick}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
              >
                <ListTitle $isMobile={isMobile}>{titleValue}</ListTitle>
              </ListTitleClickable>
            )
          ) : (
            renderTitle()
          )}
        </ListTitleContainer>
        {subtitle && <ListSubtitle>{subtitle}</ListSubtitle>}
      </ListTitleGroup>

      {isMobile && (
        <>
          <AddContentButton onClick={handleAddClick} $isMobile={isMobile}>
            <span className="icon">➕</span>
          </AddContentButton>

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptBoth ? 'video/*,image/*' : listType === 'video' ? 'video/*' : 'image/*'}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </>
      )}
    </ListHeader>
  );
};

export default ContentListHeader;