import React, { useState } from 'react';
import { styles } from './styles';

interface ContentListHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  isSystem: boolean;
  isEditable: boolean;
  listId?: string;
  onTitleChange: (newTitle: string) => void;
  onIconClick: () => void;
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

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTitleFocused(false);
    if (!e.target.value.trim()) {
      onTitleChange('My new playlist');
    } else {
      onTitleChange(e.target.value);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleIconClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (isEditable && isTitleFocused) {
      onIconClick();
    }
  };

  const iconStyle = {
    ...styles.listIcon,
    ...(isEditable ? styles.listIconEditable : {}),
    ...(isTitleFocused ? styles.listIconFocused : {}),
    ...(isTitleFocused && isIconHovered ? styles.listIconFocusedHover : {}),
  };

  const deleteButtonStyle = {
    ...styles.listDeleteBtn,
    ...(isTitleFocused ? styles.listDeleteBtnVisible : {}),
    ...(isDeleteHovered ? styles.listDeleteBtnHover : {}),
  };

  return (
    <div style={styles.listHeader}>
      <span
        className="list-icon"
        style={iconStyle}
        onClick={handleIconClick}
        onMouseEnter={() => setIsIconHovered(true)}
        onMouseLeave={() => setIsIconHovered(false)}
      >
        {icon}
      </span>
      <div style={styles.listTitleGroup}>
        {isEditable ? (
          <input
            type="text"
            style={styles.listTitleEditable}
            defaultValue={title}
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
        {subtitle && <p style={styles.listSubtitle}>{subtitle}</p>}
      </div>
      {!isSystem && (
        <button
          style={deleteButtonStyle}
          onClick={onDelete}
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ContentListHeader;