import React, { useState } from 'react';
import { Post } from '@models/Post';
import PostItem from './PostItem';
import { styles } from './styles';

interface CalendarDayProps {
  day: number;
  date: Date;
  isPast: boolean;
  isToday: boolean;
  posts: Post[];
  onDrop: (date: Date, contentId: string) => void;
  onPostClick: (post: Post) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  date,
  isPast,
  isToday,
  posts,
  onDrop,
  onPostClick,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
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
    const contentId = e.dataTransfer.getData('contentId');
    onDrop(date, contentId);
  };

  const showHoverBorder = isHovered && !isPast && !isToday;

  const dayStyle = {
    ...styles.calendarDay,
    ...(isPast ? styles.calendarDayPast : {}),
    ...(isToday ? styles.calendarDayToday : {}),
    ...(isDragOver ? styles.calendarDayDragOver : {}),
    ...(showHoverBorder ? styles.calendarDayHover : {}),
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
    >
      <div style={isToday ? styles.dayNumberToday : styles.dayNumber}>{day}</div>
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