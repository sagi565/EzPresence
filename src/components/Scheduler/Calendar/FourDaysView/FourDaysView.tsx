import React, { useState, useEffect } from 'react';
import { Post } from '@models/Post';
import { styles } from './styles';
import FourDaysViewPost from './FourDaysViewPost';

interface FourDaysViewProps {
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  posts: Post[];
  onDayChange: (direction: number) => void;
  onDrop: (date: Date, time: string, contentId: string) => void;
  onPostClick?: (post: Post) => void;
}

const FourDaysView: React.FC<FourDaysViewProps> = ({
  currentYear,
  currentMonth,
  currentDay,
  posts,
  onDayChange,
  onDrop,
  onPostClick,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getDays = () => {
    const days = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date(currentYear, currentMonth, currentDay + i);
      days.push(date);
    }
    return days;
  };

  const days = getDays();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const formatDayHeader = (date: Date) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      dayName: dayNames[date.getDay()],
      date: date.getDate(),
      month: monthNames[date.getMonth()],
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPastCell = (date: Date, hour: number) => {
    const now = new Date();
    const cellDate = new Date(date);
    cellDate.setHours(hour, 0, 0, 0);
    return cellDate < now;
  };

  const getPostsForCell = (date: Date, hour: number) => {
    return posts.filter((post) => {
      const postDate = new Date(post.date);
      const postHour = parseInt(post.time.split(':')[0]);
      const postPeriod = post.time.includes('PM') ? 'PM' : 'AM';
      let adjustedPostHour = postHour;

      if (postPeriod === 'PM' && postHour !== 12) {
        adjustedPostHour = postHour + 12;
      } else if (postPeriod === 'AM' && postHour === 12) {
        adjustedPostHour = 0;
      }

      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear() &&
        adjustedPostHour === hour
      );
    });
  };

  const shouldShowTimeIndicator = (date: Date) => {
    return isToday(date);
  };

  const handleDragOver = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const cellId = `${date.toISOString()}-${hour}`;
    setHoveredCell(cellId);
  };

  const handleDragLeave = () => {
    setHoveredCell(null);
  };

  const handleDrop = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    setHoveredCell(null);
    const contentId = e.dataTransfer.getData('contentId');
    const time = formatHour(hour);
    onDrop(date, time, contentId);
  };

  const handleMouseEnter = (date: Date, hour: number) => {
    const cellId = `${date.toISOString()}-${hour}`;
    setHoveredCell(cellId);
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        <div style={styles.headerRow}>
          <div style={styles.timeHeader}>Time</div>
          {days.map((day, index) => {
            const header = formatDayHeader(day);
            const isTodayDay = isToday(day);
            return (
              <div key={index} style={{ ...styles.dayHeader, ...(isTodayDay ? styles.dayHeaderToday : {}) }}>
                <div style={styles.dayName}>{header.dayName}</div>
                <div style={styles.dayDate}>{header.month} {header.date}</div>
              </div>
            );
          })}
        </div>

        <div style={styles.bodyContainer}>
          {hours.map((hour) => (
            <div key={hour} style={styles.timeRow}>
              <div style={styles.timeLabel}>{formatHour(hour)}</div>
              {days.map((day, dayIndex) => {
                const cellId = `${day.toISOString()}-${hour}`;
                const cellPosts = getPostsForCell(day, hour);
                const isHovered = hoveredCell === cellId;
                const isTodayDay = isToday(day);
                const isPast = isPastCell(day, hour);
                const showIndicator = shouldShowTimeIndicator(day) && hour === currentTime.getHours();

                const maxVisible = 2;
                const visiblePosts = cellPosts.slice(0, maxVisible);
                const hasOverflow = cellPosts.length > maxVisible;

                return (
                  <div
                    key={dayIndex}
                    style={{
                      ...styles.dayCell,
                      ...(isTodayDay ? styles.dayCellToday : {}),
                      ...(isPast ? styles.dayCellPast : {}),
                      ...(isHovered && !isPast && !isTodayDay ? styles.dayCellHover : {}),
                      ...(isHovered && !isPast && isTodayDay ? styles.dayCellTodayHover : {}),
                    }}
                    onDragOver={(e) => handleDragOver(e, day, hour)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day, hour)}
                    onMouseEnter={() => handleMouseEnter(day, hour)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div style={styles.postContainer}>
                      {visiblePosts.map((post, idx) => (
                        <FourDaysViewPost
                          key={post.id}
                          post={post}
                          isHalf={visiblePosts.length === 2}
                          onClick={onPostClick}
                        />
                      ))}
                    </div>
                    {hasOverflow && (
                      <div style={styles.overflowIndicator}>
                        +{cellPosts.length - maxVisible}
                      </div>
                    )}
                    {showIndicator && (
                      <div style={{ ...styles.timeIndicator, top: `${(currentTime.getMinutes() / 60) * 100}%` }}>
                        <div style={styles.timeIndicatorDot} />
                        <div style={styles.timeIndicatorLine} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FourDaysView;