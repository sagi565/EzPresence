import React from 'react';
import { Post } from '@models/Post';
import CalendarDay from './CalendarDay';
import { styles } from './styles';

interface CalendarGridProps {
  currentYear: number;
  currentMonth: number;
  posts: Post[];
  today: Date;
  onDrop: (date: Date, contentId: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentYear,
  currentMonth,
  posts,
  today,
  onDrop,
}) => {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const todayDate = new Date(today);
  todayDate.setHours(0, 0, 0, 0);

  const days = [];

  // Leading blanks
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} style={styles.calendarDay} />);
  }

  // Days with posts
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
        posts={dayPosts}
        onDrop={onDrop}
      />
    );
  }

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
      <div style={styles.calendarBody}>{days}</div>
    </div>
  );
};

export default CalendarGrid;