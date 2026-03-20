import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as S from './styles';

interface TimePickerProps {
    selectedTime: string; // Format: "HH:MM AM/PM"
    onChange: (time: string) => void;
    show: boolean;
    onClose?: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
    selectedTime,
    onChange,
    show,
}) => {
    const hourWheelRef = useRef<HTMLDivElement>(null);
    const minWheelRef = useRef<HTMLDivElement>(null);
    const periodWheelRef = useRef<HTMLDivElement>(null);

    // Track selection internally for local highlighting
    const [localHour, setLocalHour] = useState(1);
    const [localMin, setLocalMin] = useState(0);
    const [localPeriod, setLocalPeriod] = useState<'AM' | 'PM'>('AM');

    const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initial parsing from prop
    useEffect(() => {
        if (selectedTime) {
            const [timePart, period] = selectedTime.split(' ');
            const [hourStr, minStr] = timePart.split(':');
            setLocalHour(parseInt(hourStr));
            setLocalMin(parseInt(minStr));
            setLocalPeriod(period as 'AM' | 'PM');
        }
    }, [selectedTime]);

    // Initial scroll when opening
    useEffect(() => {
        if (show) {
            setTimeout(() => {
                scrollToValue(hourWheelRef, localHour - 1);
                scrollToValue(minWheelRef, localMin);
                scrollToValue(periodWheelRef, localPeriod === 'AM' ? 0 : 1);
            }, 50);
        }
    }, [show]);

    const scrollToValue = (ref: React.RefObject<HTMLDivElement>, index: number) => {
        if (!ref.current) return;
        const itemHeight = 36;
        ref.current.scrollTo({
            top: index * itemHeight,
            behavior: 'smooth'
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
        const index = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, values.length - 1));
        const newValue = values[clampedIndex];

        if (type === 'hour') setLocalHour(newValue);
        if (type === 'min') setLocalMin(newValue);
        if (type === 'period') setLocalPeriod(newValue);

        scrollTimerRef.current = setTimeout(() => {
            const timeStr = `${type === 'hour' ? newValue : localHour}:${(type === 'min' ? newValue : localMin).toString().padStart(2, '0')} ${type === 'period' ? newValue : localPeriod}`;
            onChange(timeStr);
        }, 150);
    }, [localHour, localMin, localPeriod, onChange]);

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
        <S.Container $show={show} className="time-picker" onClick={(e) => e.stopPropagation()}>
            <S.Header>
                <S.HeaderLabel>Hour</S.HeaderLabel>
                <S.HeaderLabel style={{ flex: '0.15' }}></S.HeaderLabel>
                <S.HeaderLabel>Minute</S.HeaderLabel>
                <S.HeaderLabel style={{ flex: '0.8' }}></S.HeaderLabel>
            </S.Header>

            <S.Wheel className="ntp-wheel">
                <S.WheelCol
                    ref={hourWheelRef}
                    onScroll={() => handleScroll(hourWheelRef, hours, 'hour')}
                >
                    <S.Spacer />
                    {hours.map((hour, i) => (
                        <S.WheelItem
                            key={hour}
                            $isActive={localHour === hour}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleItemClick(hourWheelRef, i);
                            }}
                        >
                            {hour}
                        </S.WheelItem>
                    ))}
                    <S.Spacer />
                </S.WheelCol>

                <S.Separator>:</S.Separator>

                <S.WheelCol
                    ref={minWheelRef}
                    onScroll={() => handleScroll(minWheelRef, minutes, 'min')}
                >
                    <S.Spacer />
                    {minutes.map((min, i) => (
                        <S.WheelItem
                            key={min}
                            $isActive={localMin === min}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleItemClick(minWheelRef, i);
                            }}
                        >
                            {min.toString().padStart(2, '0')}
                        </S.WheelItem>
                    ))}
                    <S.Spacer />
                </S.WheelCol>

                <S.WheelCol
                    ref={periodWheelRef}
                    style={{ flex: '0.8' }}
                    onScroll={() => handleScroll(periodWheelRef, periods, 'period')}
                >
                    <S.Spacer />
                    {periods.map((period, i) => (
                        <S.WheelItem
                            key={period}
                            $isActive={localPeriod === period}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleItemClick(periodWheelRef, i);
                            }}
                        >
                            {period}
                        </S.WheelItem>
                    ))}
                    <S.Spacer />
                </S.WheelCol>
            </S.Wheel>
        </S.Container>
    );
};

export default TimePicker;
