import React, { useRef, useEffect, useCallback } from 'react';
import { styles } from './styles';

const ITEM_HEIGHT = 36;
const SPACER_HEIGHT = 72;

const HOURS_BASE = Array.from({ length: 12 }, (_, i) => i + 1);
const MINS_BASE = Array.from({ length: 60 }, (_, i) => i);
const PERIODS: ('AM' | 'PM')[] = ['AM', 'PM'];

// Triple-repeated for seamless circular scrolling (always start in middle rep)
const HOURS = [...HOURS_BASE, ...HOURS_BASE, ...HOURS_BASE];
const MINUTES = [...MINS_BASE, ...MINS_BASE, ...MINS_BASE];
const HOURS_REP = 12;
const MINS_REP = 60;

interface TimePickerProps {
    selectedTime: string; // Format: "HH:MM AM/PM"
    onChange: (time: string) => void;
    show: boolean;
    onClose: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ selectedTime, onChange, show }) => {
    const hourWheelRef = useRef<HTMLDivElement>(null);
    const minWheelRef = useRef<HTMLDivElement>(null);
    const periodWheelRef = useRef<HTMLDivElement>(null);

    const selectedHourRef = useRef(4);
    const selectedMinRef = useRef(0);
    const selectedPeriodRef = useRef<'AM' | 'PM'>('PM');

    // Indices into the 3-rep arrays; always kept in the middle rep after idle
    const targetHourIdx = useRef(HOURS_REP + 3);
    const targetMinIdx = useRef(MINS_REP + 0);
    const targetPeriodIdx = useRef(1);

    const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
    // Guards against re-processing the synthetic scroll event that wrapToMiddle creates
    const isWrapping = useRef(false);

    const hourToMidIdx = (h: number) => HOURS_REP + (h - 1);
    const minToMidIdx = (m: number) => MINS_REP + m;

    // ── 3D cylinder effect (driven live during scroll) ──────────────────────
    const applyTransforms = useCallback((ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return;
        const scrollTop = ref.current.scrollTop;
        const centerY = scrollTop + ref.current.clientHeight / 2;
        ref.current.querySelectorAll<HTMLElement>('.ntp-wheel-item').forEach((item, i) => {
            const itemCenter = SPACER_HEIGHT + i * ITEM_HEIGHT + ITEM_HEIGHT / 2;
            const dist = (itemCenter - centerY) / ITEM_HEIGHT;
            const rotation = Math.max(-55, Math.min(55, dist * 23));
            const scale = Math.max(0.6, 1 - Math.abs(dist) * 0.09);
            item.style.transform = `perspective(380px) rotateX(${rotation}deg) scale(${scale})`;
        });
    }, []);

    const updateHighlights = useCallback((ref: React.RefObject<HTMLDivElement>, selectedVal: number | string) => {
        if (!ref.current) return;
        ref.current.querySelectorAll('.ntp-wheel-item').forEach((item) => {
            const match = typeof selectedVal === 'number'
                ? parseInt(item.textContent || '0') === selectedVal
                : item.textContent === selectedVal;
            item.classList.toggle('in-view', match);
        });
    }, []);

    // ── Circular wrap ────────────────────────────────────────────────────────
    // After scroll stops, silently jump back to the middle repetition.
    // The value is identical so the user never notices.
    const wrapToMiddle = useCallback((
        ref: React.RefObject<HTMLDivElement>,
        repSize: number,
        targetRef: React.MutableRefObject<number>
    ) => {
        if (!ref.current) return;
        const repHeight = repSize * ITEM_HEIGHT;
        const st = ref.current.scrollTop;
        if (st < repHeight || st >= repHeight * 2) {
            isWrapping.current = true;
            const newSt = (st % repHeight) + repHeight;
            ref.current.scrollTop = newSt;
            targetRef.current = Math.round(newSt / ITEM_HEIGHT);
            applyTransforms(ref);
        }
    }, [applyTransforms]);

    // ── Open / show ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!show) return;
        setTimeout(() => {
            const hIdx = hourToMidIdx(selectedHourRef.current);
            const mIdx = minToMidIdx(selectedMinRef.current);
            const pIdx = selectedPeriodRef.current === 'AM' ? 0 : 1;

            targetHourIdx.current = hIdx;
            targetMinIdx.current = mIdx;
            targetPeriodIdx.current = pIdx;

            // Direct assignment = instant (no animation on open)
            if (hourWheelRef.current) hourWheelRef.current.scrollTop = hIdx * ITEM_HEIGHT;
            if (minWheelRef.current) minWheelRef.current.scrollTop = mIdx * ITEM_HEIGHT;
            if (periodWheelRef.current) periodWheelRef.current.scrollTop = pIdx * ITEM_HEIGHT;

            updateHighlights(hourWheelRef, selectedHourRef.current);
            updateHighlights(minWheelRef, selectedMinRef.current);
            updateHighlights(periodWheelRef, selectedPeriodRef.current);

            applyTransforms(hourWheelRef);
            applyTransforms(minWheelRef);
            applyTransforms(periodWheelRef);
        }, 50);
    }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── External selectedTime changes ────────────────────────────────────────
    useEffect(() => {
        if (!selectedTime) return;
        const [timePart, period] = selectedTime.split(' ');
        const [hourStr, minStr] = timePart.split(':');
        const newHour = parseInt(hourStr);
        const newMin = parseInt(minStr);
        const newPeriod = period as 'AM' | 'PM';

        const isExternal =
            newHour !== selectedHourRef.current ||
            newMin !== selectedMinRef.current ||
            newPeriod !== selectedPeriodRef.current;

        selectedHourRef.current = newHour;
        selectedMinRef.current = newMin;
        selectedPeriodRef.current = newPeriod;

        if (show && isExternal) {
            const hIdx = hourToMidIdx(newHour);
            const mIdx = minToMidIdx(newMin);
            const pIdx = newPeriod === 'AM' ? 0 : 1;
            targetHourIdx.current = hIdx;
            targetMinIdx.current = mIdx;
            targetPeriodIdx.current = pIdx;
            hourWheelRef.current?.scrollTo({ top: hIdx * ITEM_HEIGHT, behavior: 'smooth' });
            minWheelRef.current?.scrollTo({ top: mIdx * ITEM_HEIGHT, behavior: 'smooth' });
            periodWheelRef.current?.scrollTo({ top: pIdx * ITEM_HEIGHT, behavior: 'smooth' });
            updateHighlights(hourWheelRef, newHour);
            updateHighlights(minWheelRef, newMin);
            updateHighlights(periodWheelRef, newPeriod);
        }
    }, [selectedTime, show]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── PC mouse-wheel: one step per tick, wraps before hitting the edge ─────
    useEffect(() => {
        if (!show) return;

        const makeHandler = (
            ref: React.RefObject<HTMLDivElement>,
            len: number,
            targetRef: React.MutableRefObject<number>,
            repSize?: number
        ) => (e: WheelEvent) => {
            e.preventDefault();
            if (!ref.current) return;
            const delta = e.deltaY > 0 ? 1 : -1;

            // For circular columns: if the next step would hit the boundary of
            // the 3-rep array, silently warp to the other end first so the user
            // never experiences a dead end.
            if (repSize) {
                const next = targetRef.current + delta;
                if (next < 0 || next >= len) {
                    // Warp: flip to equivalent position in the opposite rep
                    const repHeight = repSize * ITEM_HEIGHT;
                    isWrapping.current = true;
                    const warpedSt = delta < 0
                        ? (ref.current.scrollTop % repHeight) + repHeight * 2 - ITEM_HEIGHT
                        : (ref.current.scrollTop % repHeight) + repHeight;
                    ref.current.scrollTop = warpedSt;
                    targetRef.current = Math.round(warpedSt / ITEM_HEIGHT);
                    return; // let the next wheel event proceed normally from the new position
                }
            }

            const next = Math.max(0, Math.min(targetRef.current + delta, len - 1));
            if (next === targetRef.current) return;
            targetRef.current = next;
            ref.current.scrollTo({ top: next * ITEM_HEIGHT, behavior: 'smooth' });
        };

        const opts: AddEventListenerOptions = { passive: false };
        const hH = makeHandler(hourWheelRef, HOURS.length, targetHourIdx, HOURS_REP);
        const mH = makeHandler(minWheelRef, MINUTES.length, targetMinIdx, MINS_REP);
        const pH = makeHandler(periodWheelRef, PERIODS.length, targetPeriodIdx);

        hourWheelRef.current?.addEventListener('wheel', hH, opts);
        minWheelRef.current?.addEventListener('wheel', mH, opts);
        periodWheelRef.current?.addEventListener('wheel', pH, opts);

        return () => {
            hourWheelRef.current?.removeEventListener('wheel', hH);
            minWheelRef.current?.removeEventListener('wheel', mH);
            periodWheelRef.current?.removeEventListener('wheel', pH);
        };
    }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Scroll handler (touch + snap) ────────────────────────────────────────
    const handleScroll = useCallback((
        ref: React.RefObject<HTMLDivElement>,
        values: (number | string)[],
        type: 'hour' | 'min' | 'period',
        repSize?: number,
        targetRef?: React.MutableRefObject<number>
    ) => {
        // Ignore the synthetic scroll event that wrapToMiddle fires
        if (isWrapping.current) {
            isWrapping.current = false;
            return;
        }
        if (!ref.current) return;

        applyTransforms(ref);

        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);

        const idx = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
        const clamped = Math.max(0, Math.min(idx, values.length - 1));
        const val = values[clamped];

        if (type === 'hour') { selectedHourRef.current = val as number; if (targetRef) targetRef.current = clamped; }
        if (type === 'min') { selectedMinRef.current = val as number; if (targetRef) targetRef.current = clamped; }
        if (type === 'period') { selectedPeriodRef.current = val as 'AM' | 'PM'; }

        updateHighlights(ref, val as number | string);

        scrollTimerRef.current = setTimeout(() => {
            // Warp back to middle rep after the scroll animation settles
            if (repSize && targetRef) wrapToMiddle(ref, repSize, targetRef);
            const timeStr = `${selectedHourRef.current}:${selectedMinRef.current.toString().padStart(2, '0')} ${selectedPeriodRef.current}`;
            onChange(timeStr);
        }, 200);
    }, [applyTransforms, updateHighlights, wrapToMiddle, onChange]);

    if (!show) return null;

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
                    className="ntp-wheel-col"
                    style={styles.wheelCol}
                    onScroll={() => handleScroll(hourWheelRef, HOURS, 'hour', HOURS_REP, targetHourIdx)}
                >
                    <div style={styles.spacer} />
                    {HOURS.map((hour, i) => (
                        <button
                            key={`h-${i}`}
                            className="ntp-wheel-item"
                            style={styles.wheelItem}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                const midIdx = hourToMidIdx(hour);
                                targetHourIdx.current = midIdx;
                                hourWheelRef.current?.scrollTo({ top: midIdx * ITEM_HEIGHT, behavior: 'smooth' });
                            }}
                        >
                            {hour}
                        </button>
                    ))}
                    <div style={styles.spacer} />
                </div>

                <div style={styles.separator}>:</div>

                {/* Minute column */}
                <div
                    ref={minWheelRef}
                    className="ntp-wheel-col"
                    style={styles.wheelCol}
                    onScroll={() => handleScroll(minWheelRef, MINUTES, 'min', MINS_REP, targetMinIdx)}
                >
                    <div style={styles.spacer} />
                    {MINUTES.map((min, i) => (
                        <button
                            key={`m-${i}`}
                            className="ntp-wheel-item"
                            style={styles.wheelItem}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                const midIdx = minToMidIdx(min);
                                targetMinIdx.current = midIdx;
                                minWheelRef.current?.scrollTo({ top: midIdx * ITEM_HEIGHT, behavior: 'smooth' });
                            }}
                        >
                            {min.toString().padStart(2, '0')}
                        </button>
                    ))}
                    <div style={styles.spacer} />
                </div>

                {/* Period column */}
                <div
                    ref={periodWheelRef}
                    className="ntp-wheel-col"
                    style={{ ...styles.wheelCol, flex: '0.8' }}
                    onScroll={() => handleScroll(periodWheelRef, PERIODS, 'period')}
                >
                    <div style={styles.spacer} />
                    {PERIODS.map((period, i) => (
                        <button
                            key={period}
                            className="ntp-wheel-item"
                            style={styles.wheelItem}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                targetPeriodIdx.current = i;
                                periodWheelRef.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
                            }}
                        >
                            {period}
                        </button>
                    ))}
                    <div style={styles.spacer} />
                </div>
            </div>
        </div>
    );
};

export default TimePicker;
