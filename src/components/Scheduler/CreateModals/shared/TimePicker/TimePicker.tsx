import React, { useRef, useEffect, useState } from 'react';
import { styles } from './styles';

interface TimePickerProps {
    selectedTime: string; // Format: "HH:MM AM/PM"
    onChange: (time: string) => void;
    show: boolean;
    onClose: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
    selectedTime,
    onChange,
    show,
    onClose,
}) => {
    const hourWheelRef = useRef<HTMLDivElement>(null);
    const minWheelRef = useRef<HTMLDivElement>(null);
    const periodWheelRef = useRef<HTMLDivElement>(null);

    const [selectedHour, setSelectedHour] = useState(4);
    const [selectedMin, setSelectedMin] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('PM');

    // Parse initial time
    useEffect(() => {
        if (selectedTime) {
            const [timePart, period] = selectedTime.split(' ');
            const [hourStr, minStr] = timePart.split(':');
            setSelectedHour(parseInt(hourStr));
            setSelectedMin(parseInt(minStr));
            setSelectedPeriod(period as 'AM' | 'PM');
        }
    }, [selectedTime]);

    // Scroll to selected values when opening
    useEffect(() => {
        if (show) {
            setTimeout(() => {
                scrollToValue(hourWheelRef, selectedHour - 1);
                scrollToValue(minWheelRef, selectedMin);
                scrollToValue(periodWheelRef, selectedPeriod === 'AM' ? 0 : 1);
            }, 50);
        }
    }, [show, selectedHour, selectedMin, selectedPeriod]);

    // Attach custom wheel listeners to dampen scroll - REMOVED to allow smooth native scroll snap
    // The native CSS scroll-snap provides a better experience and we want the "thick line" style to work
    // which relies on the .ntp-wheel class on the container (see styles.ts and line 153 below)

    const scrollToValue = (ref: React.RefObject<HTMLDivElement>, index: number) => {
        if (!ref.current) return;
        const itemHeight = 36;
        const spacerHeight = 72;
        ref.current.scrollTo({
            top: spacerHeight + index * itemHeight,
            behavior: 'smooth'
        });
    };

    const handleScroll = (
        ref: React.RefObject<HTMLDivElement>,
        setter: (val: any) => void,
        values: any[],
        type: 'hour' | 'min' | 'period'
    ) => {
        if (!ref.current) return;

        const itemHeight = 36;
        const spacerHeight = 72;
        const scrollTop = ref.current.scrollTop;

        // Round to nearest item for smoother scrolling
        const rawIndex = (scrollTop - spacerHeight) / itemHeight;
        const index = Math.round(rawIndex);
        const clampedIndex = Math.max(0, Math.min(index, values.length - 1));

        const newValue = values[clampedIndex];
        const currentValue = type === 'hour' ? selectedHour : type === 'min' ? selectedMin : selectedPeriod;

        // Only update if value actually changed
        if (newValue !== currentValue) {
            setter(newValue);

            // Update in-view class
            const items = ref.current.querySelectorAll('.ntp-wheel-item');
            items.forEach((item, i) => {
                if (i === clampedIndex) {
                    item.classList.add('in-view');
                } else {
                    item.classList.remove('in-view');
                }
            });

            // Emit onChange
            emitChange(
                type === 'hour' ? newValue : selectedHour,
                type === 'min' ? newValue : selectedMin,
                type === 'period' ? newValue : selectedPeriod
            );
        }
    };

    const emitChange = (hour: number, min: number, period: 'AM' | 'PM') => {
        const timeStr = `${hour}:${min.toString().padStart(2, '0')} ${period}`;
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
                    onScroll={() => handleScroll(hourWheelRef, setSelectedHour, hours, 'hour')}
                >
                    <div style={styles.spacer}></div>
                    {hours.map((hour, i) => (
                        <button
                            key={hour}
                            className={`ntp-wheel-item ${hour === selectedHour ? 'in-view' : ''}`}
                            style={styles.wheelItem}
                            onClick={() => handleItemClick(hourWheelRef, i)}
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
                    onScroll={() => handleScroll(minWheelRef, setSelectedMin, minutes, 'min')}
                >
                    <div style={styles.spacer}></div>
                    {minutes.map((min, i) => (
                        <button
                            key={min}
                            className={`ntp-wheel-item ${min === selectedMin ? 'in-view' : ''}`}
                            style={styles.wheelItem}
                            onClick={() => handleItemClick(minWheelRef, i)}
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
                    onScroll={() => handleScroll(periodWheelRef, setSelectedPeriod, periods, 'period')}
                >
                    <div style={styles.spacer}></div>
                    {periods.map((period, i) => (
                        <button
                            key={period}
                            className={`ntp-wheel-item ${period === selectedPeriod ? 'in-view' : ''}`}
                            style={styles.wheelItem}
                            onClick={() => handleItemClick(periodWheelRef, i)}
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
