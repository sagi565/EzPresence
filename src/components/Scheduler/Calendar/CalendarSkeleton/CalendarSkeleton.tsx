import React from 'react';
import {
  MonthGridWrapper,
  HeaderRow,
  DayHeaderCell,
  DayHeaderTextSkeleton,
  MonthBodyGrid,
  MonthDayCell,
  DayNumberSkeleton,
  PostSkeleton,
  FourDaysContainer,
  FourDaysGrid,
  FourDaysHeaderRow,
  FourDaysTimeHeader,
  FourDaysTimeHeaderTextSkeleton,
  FourDaysDayHeader,
  FourDaysDayNameSkeleton,
  FourDaysDayDateSkeleton,
  FourDaysBodyContainer,
  FourDaysTimeRow,
  FourDaysTimeLabel,
  FourDaysTimeLabelSkeleton,
  FourDaysDayCell,
  FourDaysPostSkeleton
} from './styles';

interface CalendarSkeletonProps {
  viewMode: 'month' | '4days';
}

const CalendarSkeleton: React.FC<CalendarSkeletonProps> = ({ viewMode }) => {
  if (viewMode === 'month') {
    const totalRows = 6;
    const days = Array.from({ length: totalRows * 7 }, (_, i) => i);

    return (
      <MonthGridWrapper>
        <HeaderRow>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((_, i) => (
            <DayHeaderCell key={`header-${i}`}>
              <DayHeaderTextSkeleton />
            </DayHeaderCell>
          ))}
        </HeaderRow>
        <MonthBodyGrid style={{ gridTemplateRows: `repeat(${totalRows}, 1fr)` }}>
          {days.map((day) => {
            // Randomly determine how many fake posts to show to look realistic
            const numPosts = (day % 3 === 0) ? 2 : (day % 5 === 0) ? 1 : 0;
            return (
              <MonthDayCell key={`day-${day}`}>
                <DayNumberSkeleton />
                {Array.from({ length: numPosts }).map((_, i) => (
                  <PostSkeleton key={`post-${i}`} />
                ))}
              </MonthDayCell>
            );
          })}
        </MonthBodyGrid>
      </MonthGridWrapper>
    );
  } else {
    // 4 Days View skeleton
    const days = [0, 1, 2, 3];
    const hours = Array.from({ length: 12 }, (_, i) => i); // Only show 12 hours max in initial view to keep skeleton fast

    return (
      <FourDaysContainer>
        <FourDaysGrid>
          <FourDaysHeaderRow>
            <FourDaysTimeHeader>
              <FourDaysTimeHeaderTextSkeleton />
            </FourDaysTimeHeader>
            {days.map((day) => (
              <FourDaysDayHeader key={`header-${day}`}>
                <FourDaysDayNameSkeleton />
                <FourDaysDayDateSkeleton />
              </FourDaysDayHeader>
            ))}
          </FourDaysHeaderRow>

          <FourDaysBodyContainer>
            {hours.map((hour) => (
              <FourDaysTimeRow key={`hour-${hour}`}>
                <FourDaysTimeLabel>
                  <FourDaysTimeLabelSkeleton />
                </FourDaysTimeLabel>
                {days.map((day) => {
                  const hasPost = (hour + day) % 4 === 0;
                  return (
                    <FourDaysDayCell key={`cell-${hour}-${day}`}>
                      {hasPost && <FourDaysPostSkeleton />}
                    </FourDaysDayCell>
                  );
                })}
              </FourDaysTimeRow>
            ))}
          </FourDaysBodyContainer>
        </FourDaysGrid>
      </FourDaysContainer>
    );
  }
};

export default CalendarSkeleton;
