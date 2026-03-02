import React, { useState } from 'react';
import { Post } from '@models/Post';
import PostItem from './PostItem';
import { styles } from './styles';

interface CalendarDayProps {
  day: number;
  date: Date;
  isPast: boolean;
  isToday: boolean;
  isOtherMonth?: boolean;
  showMonthName?: boolean;
  posts: Post[];
  onDrop: (date: Date, contentId: string, position: { x: number; y: number }) => void;
  onPostClick: (post: Post) => void;
  activeDropDate?: Date | null;
  onContextMenu?: (e: React.MouseEvent, date: Date) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  date,
  isPast,
  isToday,
  showMonthName = false,
  posts,
  onDrop,
  onPostClick,
  activeDropDate,
  onContextMenu,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (isPast) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isPast) return;
    const contentId = e.dataTransfer.getData('contentId');
    onDrop(date, contentId, { x: e.clientX, y: e.clientY });
  };

  const showHoverBorder = isHovered && !isPast && !isToday;

  const isActiveDropTarget = activeDropDate instanceof Date &&
    date.getTime() === new Date(activeDropDate).setHours(0, 0, 0, 0);

  const dayStyle = {
    ...styles.calendarDay,
    ...(isPast ? styles.calendarDayPast : {}),
    ...(isToday ? styles.calendarDayToday : {}),
    ...(isDragOver || isActiveDropTarget ? styles.calendarDayDragOver : {}),
    ...(showHoverBorder && !isDragOver && !isActiveDropTarget ? styles.calendarDayHover : {}),
  };

  const maxVisible = 2;
  const visiblePosts = posts.slice(0, maxVisible);
  const hasOverflow = posts.length > maxVisible;

  return (
    <div
      style={dayStyle}
      data-date={date.toISOString()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => {
        if (!isPast) {
          onContextMenu?.(e, date);
        }
      }}
    >
      <div style={isToday ? styles.dayNumberToday : styles.dayNumber}>
        {day}
        {showMonthName && (
          <span style={styles.monthLabel}>
            {MONTH_NAMES[date.getMonth()]}
          </span>
        )}
      </div>
      {visiblePosts.map((post) => (
        <PostItem key={post.id} post={post} onClick={onPostClick} />
      ))}
      {hasOverflow && (
        <div style={styles.overflowIndicator}>+{posts.length - maxVisible}</div>
      )}
    </div>
  );
};

export default CalendarDay;