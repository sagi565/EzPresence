import React, { useRef, useEffect, useCallback } from 'react';
import { styles } from './styles';

interface TimePickerProps {
    selectedTime: string; // Format: "HH:MM AM/PM"
    onChange: (time: string) => void;
    show: boolean;
    onClose: () => void; // Kept for interface consistency
}

const TimePicker: React.FC<TimePickerProps> = ({
    selectedTime,
    onChange,
    show,
}) => {
    const hourWheelRef = useRef<HTMLDivElement>(null);
    const minWheelRef = useRef<HTMLDivElement>(null);
    const periodWheelRef = useRef<HTMLDivElement>(null);

    // Track selection internally via refs
    const selectedHourRef = useRef(4);
    const selectedMinRef = useRef(0);
    const selectedPeriodRef = useRef<'AM' | 'PM'>('PM');

    const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Initial Scroll when opening
    useEffect(() => {
        if (show) {
            // Slight delay to ensure layout is painted
            setTimeout(() => {
                scrollToValue(hourWheelRef, selectedHourRef.current - 1);
                scrollToValue(minWheelRef, selectedMinRef.current);
                scrollToValue(periodWheelRef, selectedPeriodRef.current === 'AM' ? 0 : 1);

                updateHighlights(hourWheelRef, selectedHourRef.current);
                updateHighlights(minWheelRef, selectedMinRef.current);
                updateHighlights(periodWheelRef, selectedPeriodRef.current);
            }, 50);
        }
    }, [show]);

    // 2. Sync refs with props when selectedTime changes externally
    useEffect(() => {
        if (selectedTime) {
            const [timePart, period] = selectedTime.split(' ');
            const [hourStr, minStr] = timePart.split(':');
            const newHour = parseInt(hourStr);
            const newMin = parseInt(minStr);
            const newPeriod = period as 'AM' | 'PM';

            // Check if values actually changed (to avoid fighting with user scroll)
            // If the prop update matches our current refs, it's likely our own update coming back.
            // If it differs, it's an external change (or we drifted), so we sync.
            // Note: We update refs regardless to be safe, but we only SCROLL if it looks like an external jump.

            const isExternalChange =
                newHour !== selectedHourRef.current ||
                newMin !== selectedMinRef.current ||
                newPeriod !== selectedPeriodRef.current;

            selectedHourRef.current = newHour;
            selectedMinRef.current = newMin;
            selectedPeriodRef.current = newPeriod;

            // Only programmatic scroll if it's an external change AND the picker is visible.
            // If the user just scrolled, isExternalChange should be false (because we updated refs in handleScroll).
            if (show && isExternalChange) {
                scrollToValue(hourWheelRef, newHour - 1);
                scrollToValue(minWheelRef, newMin);
                scrollToValue(periodWheelRef, newPeriod === 'AM' ? 0 : 1);

                updateHighlights(hourWheelRef, newHour);
                updateHighlights(minWheelRef, newMin);
                updateHighlights(periodWheelRef, newPeriod);
            }
        }
    }, [selectedTime, show]);

    const scrollToValue = (ref: React.RefObject<HTMLDivElement>, index: number) => {
        if (!ref.current) return;
        const itemHeight = 36;
        // Correct math: scrollTop should be index * itemHeight to center the item
        // because the spacer (72px) equals the centering offset (90px - 18px).
        ref.current.scrollTo({
            top: index * itemHeight,
            behavior: 'smooth'
        });
    };

    const updateHighlights = (ref: React.RefObject<HTMLDivElement>, selectedVal: any) => {
        if (!ref.current) return;
        const items = ref.current.querySelectorAll('.ntp-wheel-item');
        items.forEach((item) => {
            const itemVal = item.textContent;
            let isSelected = false;

            if (typeof selectedVal === 'number') {
                isSelected = parseInt(itemVal || '0') === selectedVal;
            } else {
                isSelected = itemVal === selectedVal;
            }

            if (isSelected) {
                item.classList.add('in-view');
            } else {
                item.classList.remove('in-view');
            }
        });
    };

    const handleScroll = useCallback((
        ref: React.RefObject<HTMLDivElement>,
        values: any[],
        type: 'hour' | 'min' | 'period'
    ) => {
        if (!ref.current) return;

        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);

        const itemHeight = 36;
        const scrollTop = ref.current.scrollTop;

        // Correct math: index = scrollTop / itemHeight
        const index = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, values.length - 1));
        const newValue = values[clampedIndex];

        if (type === 'hour') selectedHourRef.current = newValue;
        if (type === 'min') selectedMinRef.current = newValue;
        if (type === 'period') selectedPeriodRef.current = newValue;

        updateHighlights(ref, newValue);

        // Debounce update
        scrollTimerRef.current = setTimeout(() => {
            emitChange();
        }, 100); // 100ms debounce
    }, []);

    const emitChange = () => {
        const timeStr = `${selectedHourRef.current}:${selectedMinRef.current.toString().padStart(2, '0')} ${selectedPeriodRef.current}`;
        onChange(timeStr);
    };

    const handleItemClick = (
        ref: React.RefObject<HTMLDivElement>,
        index: number
    ) => {
        scrollToValue(ref, index);
    };

    if (!show) return null;

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

    return (
        <div style={styles.container} className="time-picker" onClick={(e) => e.stopPropagation()}>
            <div style={styles.header}>
                <span style={styles.headerLabel}>Hour</span>
                <span style={{ ...styles.headerLabel, flex: '0.15' }}></span>
                <span style={styles.headerLabel}>Minute</span>
                <span style={{ ...styles.headerLabel, flex: '0.8' }}></span>
            </div>

            <div style={styles.wheel} className="ntp-wheel">
                {/* Hour column */}
                <div
                    ref={hourWheelRef}
                    style={styles.wheelCol}
                    onScroll={() => handleScroll(hourWheelRef, hours, 'hour')}
                >
                    <div style={styles.spacer}></div>
                    {hours.map((hour, i) => (
                        <button
                            key={hour}
                            className="ntp-wheel-item"
                            style={styles.wheelItem}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleItemClick(hourWheelRef, i);
                            }}
                        >
                            {hour}
                        </button>
                    ))}
                    <div style={styles.spacer}></div>
                </div>

                {/* Separator */}
                <div style={styles.separator}>:</div>

                {/* Minute column */}
                <div
                    ref={minWheelRef}
                    style={styles.wheelCol}
                    onScroll={() => handleScroll(minWheelRef, minutes, 'min')}
                >
                    <div style={styles.spacer}></div>
                    {minutes.map((min, i) => (
                        <button
                            key={min}
                            className="ntp-wheel-item"
                            style={styles.wheelItem}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleItemClick(minWheelRef, i);
                            }}
                        >
                            {min.toString().padStart(2, '0')}
                        </button>
                    ))}
                    <div style={styles.spacer}></div>
                </div>

                {/* Period column */}
                <div
                    ref={periodWheelRef}
                    style={{ ...styles.wheelCol, flex: '0.8' }}
                    onScroll={() => handleScroll(periodWheelRef, periods, 'period')}
                >
                    <div style={styles.spacer}></div>
                    {periods.map((period, i) => (
                        <button
                            key={period}
                            className="ntp-wheel-item"
                            style={styles.wheelItem}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleItemClick(periodWheelRef, i);
                            }}
                        >
                            {period}
                        </button>
                    ))}
                    <div style={styles.spacer}></div>
                </div>
            </div>
        </div>
    );
};

export default TimePicker;
