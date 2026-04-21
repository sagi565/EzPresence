import React, { useState } from 'react';
import { Post } from '@models/Post';
import PostItem from './PostItem';
import {
  CalendarDayCell,
  DayNumber,
  MonthLabel,
  OverflowIndicator,
  DayCircle
} from './styles';

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
  onPostContextMenu?: (post: Post, x: number, y: number) => void;
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
  isOtherMonth = false,
  posts,
  onDrop,
  onPostClick,
  activeDropDate,
  onContextMenu,
  onPostContextMenu,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

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

  const isActiveDropTarget = activeDropDate instanceof Date &&
    date.getTime() === new Date(activeDropDate).setHours(0, 0, 0, 0);

  const maxVisible = 2;
  const visiblePosts = posts.slice(0, maxVisible);
  const hasOverflow = posts.length > maxVisible;

  return (
    <CalendarDayCell
      $isPast={isPast}
      $isToday={isToday}
      $isOtherMonth={isOtherMonth}
      $isDragOver={isDragOver || isActiveDropTarget}
      data-date={date.toISOString()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        if (!isPast) {
          onContextMenu?.(e, date);
        }
      }}
    >
      <DayNumber $isToday={isToday} $isOtherMonth={isOtherMonth}>
        {isToday ? <DayCircle>{day}</DayCircle> : day}
        {showMonthName && (
          <MonthLabel>
            {MONTH_NAMES[date.getMonth()]}
          </MonthLabel>
        )}
      </DayNumber>
      {visiblePosts.map((post) => (
        <PostItem key={post.id} post={post} onClick={onPostClick} onPostContextMenu={onPostContextMenu} />
      ))}
      {hasOverflow && (
        <OverflowIndicator>+{posts.length - maxVisible}</OverflowIndicator>
      )}
    </CalendarDayCell>
  );
};

export default CalendarDay;