import React from 'react';
import { Post } from '@models/Post';
import CalendarDay from './CalendarDay';
import { styles } from './styles';

interface CalendarGridProps {
  currentYear: number;
  currentMonth: number;
  posts: Post[];
  today: Date;
  onDrop: (date: Date, contentId: string, position: { x: number; y: number }) => void;
  onPostClick: (post: Post) => void;
  activeDropDate?: Date | null;
  onContextMenu?: (e: React.MouseEvent, date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentYear,
  currentMonth,
  posts,
  today,
  onDrop,
  onPostClick,
  activeDropDate,
  onContextMenu,
}) => {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const todayDate = new Date(today);
  todayDate.setHours(0, 0, 0, 0);

  const days: React.ReactNode[] = [];

  // Leading days from previous month
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dayDate = new Date(prevYear, prevMonth, dayNum);
    dayDate.setHours(0, 0, 0, 0);
    const isPast = dayDate < todayDate;
    const isToday = dayDate.getTime() === todayDate.getTime();
    // showMonthName on the 1st of the prev month only when it falls in the grid
    const showMonthName = dayNum === 1;

    const dayPosts = posts.filter((p) => {
      const pd = new Date(p.date);
      return (
        pd.getDate() === dayNum &&
        pd.getMonth() === prevMonth &&
        pd.getFullYear() === prevYear
      );
    }).sort((a, b) => a.time.localeCompare(b.time));

    days.push(
      <CalendarDay
        key={`prev-${dayNum}`}
        day={dayNum}
        date={dayDate}
        isPast={isPast}
        isToday={isToday}
        isOtherMonth
        showMonthName={showMonthName}
        posts={dayPosts}
        onDrop={onDrop}
        onPostClick={onPostClick}
        activeDropDate={activeDropDate}
        onContextMenu={onContextMenu}
      />
    );
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(currentYear, currentMonth, day);
    dayDate.setHours(0, 0, 0, 0);
    const isPast = dayDate < todayDate;
    const isToday = dayDate.getTime() === todayDate.getTime();

    const dayPosts = posts.filter((p) => {
      const pd = new Date(p.date);
      return (
        pd.getDate() === day &&
        pd.getMonth() === currentMonth &&
        pd.getFullYear() === currentYear
      );
    }).sort((a, b) => a.time.localeCompare(b.time));

    days.push(
      <CalendarDay
        key={day}
        day={day}
        date={dayDate}
        isPast={isPast}
        isToday={isToday}
        showMonthName={day === 1}
        posts={dayPosts}
        onDrop={onDrop}
        onPostClick={onPostClick}
        activeDropDate={activeDropDate}
        onContextMenu={onContextMenu}
      />
    );
  }

  // Trailing days from next month
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const trailingCount = totalCells - (firstDay + daysInMonth);
  for (let i = 1; i <= trailingCount; i++) {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dayDate = new Date(nextYear, nextMonth, i);
    dayDate.setHours(0, 0, 0, 0);
    const isPast = dayDate < todayDate;
    const isToday = dayDate.getTime() === todayDate.getTime();
    const showMonthName = i === 1;

    const dayPosts = posts.filter((p) => {
      const pd = new Date(p.date);
      return (
        pd.getDate() === i &&
        pd.getMonth() === nextMonth &&
        pd.getFullYear() === nextYear
      );
    }).sort((a, b) => a.time.localeCompare(b.time));

    days.push(
      <CalendarDay
        key={`next-${i}`}
        day={i}
        date={dayDate}
        isPast={isPast}
        isToday={isToday}
        isOtherMonth
        showMonthName={showMonthName}
        posts={dayPosts}
        onDrop={onDrop}
        onPostClick={onPostClick}
        activeDropDate={activeDropDate}
        onContextMenu={onContextMenu}
      />
    );
  }

  const totalRows = Math.ceil((firstDay + daysInMonth) / 7);

  return (
    <div style={styles.calendarGrid}>
      <div style={styles.calendarHeader}>
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
          (dayName) => (
            <div key={dayName} style={styles.dayHeader}>
              {dayName}
            </div>
          )
        )}
      </div>
      <div
        style={{
          ...styles.calendarBody,
          gridTemplateRows: `repeat(${totalRows}, 1fr)`,
        }}
      >
        {days}
      </div>
    </div>
  );
};

export default CalendarGrid;