import React, { useState, useRef, useEffect } from 'react';
import { styles } from './styles';

export interface TimezoneOption {
    value: string; // IANA timezone identifier
    label: string; // Display name
    country: string; // Country name
    flag: string; // Flag emoji
    offset: string; // UTC offset (e.g., "+02:00")
}

interface TimezoneSelectorProps {
    selectedTimezone: string;
    onChange: (timezone: string) => void;
    show: boolean;
    onClose: () => void;
}

// Comprehensive timezone list with flags
export const TIMEZONES: TimezoneOption[] = [
    // Americas
    { value: 'America/New_York', label: 'Eastern Time', country: 'USA', flag: '🇺🇸', offset: '-05:00' },
    { value: 'America/Chicago', label: 'Central Time', country: 'USA', flag: '🇺🇸', offset: '-06:00' },
    { value: 'America/Denver', label: 'Mountain Time', country: 'USA', flag: '🇺🇸', offset: '-07:00' },
    { value: 'America/Los_Angeles', label: 'Pacific Time', country: 'USA', flag: '🇺🇸', offset: '-08:00' },
    { value: 'America/Anchorage', label: 'Alaska Time', country: 'USA', flag: '🇺🇸', offset: '-09:00' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time', country: 'USA', flag: '🇺🇸', offset: '-10:00' },
    { value: 'America/Toronto', label: 'Toronto', country: 'Canada', flag: '🇨🇦', offset: '-05:00' },
    { value: 'America/Vancouver', label: 'Vancouver', country: 'Canada', flag: '🇨🇦', offset: '-08:00' },
    { value: 'America/Mexico_City', label: 'Mexico City', country: 'Mexico', flag: '🇲🇽', offset: '-06:00' },
    { value: 'America/Sao_Paulo', label: 'São Paulo', country: 'Brazil', flag: '🇧🇷', offset: '-03:00' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', offset: '-03:00' },

    // Europe
    { value: 'Europe/London', label: 'London', country: 'UK', flag: '🇬🇧', offset: '+00:00' },
    { value: 'Europe/Dublin', label: 'Dublin', country: 'Ireland', flag: '🇮🇪', offset: '+00:00' },
    { value: 'Europe/Paris', label: 'Paris', country: 'France', flag: '🇫🇷', offset: '+01:00' },
    { value: 'Europe/Berlin', label: 'Berlin', country: 'Germany', flag: '🇩🇪', offset: '+01:00' },
    { value: 'Europe/Rome', label: 'Rome', country: 'Italy', flag: '🇮🇹', offset: '+01:00' },
    { value: 'Europe/Madrid', label: 'Madrid', country: 'Spain', flag: '🇪🇸', offset: '+01:00' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', offset: '+01:00' },
    { value: 'Europe/Brussels', label: 'Brussels', country: 'Belgium', flag: '🇧🇪', offset: '+01:00' },
    { value: 'Europe/Zurich', label: 'Zurich', country: 'Switzerland', flag: '🇨🇭', offset: '+01:00' },
    { value: 'Europe/Vienna', label: 'Vienna', country: 'Austria', flag: '🇦🇹', offset: '+01:00' },
    { value: 'Europe/Stockholm', label: 'Stockholm', country: 'Sweden', flag: '🇸🇪', offset: '+01:00' },
    { value: 'Europe/Copenhagen', label: 'Copenhagen', country: 'Denmark', flag: '🇩🇰', offset: '+01:00' },
    { value: 'Europe/Oslo', label: 'Oslo', country: 'Norway', flag: '🇳🇴', offset: '+01:00' },
    { value: 'Europe/Helsinki', label: 'Helsinki', country: 'Finland', flag: '🇫🇮', offset: '+02:00' },
    { value: 'Europe/Warsaw', label: 'Warsaw', country: 'Poland', flag: '🇵🇱', offset: '+01:00' },
    { value: 'Europe/Prague', label: 'Prague', country: 'Czech Republic', flag: '🇨🇿', offset: '+01:00' },
    { value: 'Europe/Budapest', label: 'Budapest', country: 'Hungary', flag: '🇭🇺', offset: '+01:00' },
    { value: 'Europe/Athens', label: 'Athens', country: 'Greece', flag: '🇬🇷', offset: '+02:00' },
    { value: 'Europe/Istanbul', label: 'Istanbul', country: 'Turkey', flag: '🇹🇷', offset: '+03:00' },
    { value: 'Europe/Moscow', label: 'Moscow', country: 'Russia', flag: '🇷🇺', offset: '+03:00' },

    // Middle East & Africa
    { value: 'Asia/Jerusalem', label: 'Jerusalem', country: 'Israel', flag: '🇮🇱', offset: '+02:00' },
    { value: 'Asia/Dubai', label: 'Dubai', country: 'UAE', flag: '🇦🇪', offset: '+04:00' },
    { value: 'Asia/Riyadh', label: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', offset: '+03:00' },
    { value: 'Africa/Cairo', label: 'Cairo', country: 'Egypt', flag: '🇪🇬', offset: '+02:00' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg', country: 'South Africa', flag: '🇿🇦', offset: '+02:00' },
    { value: 'Africa/Lagos', label: 'Lagos', country: 'Nigeria', flag: '🇳🇬', offset: '+01:00' },
    { value: 'Africa/Nairobi', label: 'Nairobi', country: 'Kenya', flag: '🇰🇪', offset: '+03:00' },

    // Asia
    { value: 'Asia/Kolkata', label: 'Mumbai/Delhi', country: 'India', flag: '🇮🇳', offset: '+05:30' },
    { value: 'Asia/Bangkok', label: 'Bangkok', country: 'Thailand', flag: '🇹🇭', offset: '+07:00' },
    { value: 'Asia/Singapore', label: 'Singapore', country: 'Singapore', flag: '🇸🇬', offset: '+08:00' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰', offset: '+08:00' },
    { value: 'Asia/Shanghai', label: 'Beijing/Shanghai', country: 'China', flag: '🇨🇳', offset: '+08:00' },
    { value: 'Asia/Tokyo', label: 'Tokyo', country: 'Japan', flag: '🇯🇵', offset: '+09:00' },
    { value: 'Asia/Seoul', label: 'Seoul', country: 'South Korea', flag: '🇰🇷', offset: '+09:00' },
    { value: 'Asia/Manila', label: 'Manila', country: 'Philippines', flag: '🇵🇭', offset: '+08:00' },
    { value: 'Asia/Jakarta', label: 'Jakarta', country: 'Indonesia', flag: '🇮🇩', offset: '+07:00' },
    { value: 'Asia/Karachi', label: 'Karachi', country: 'Pakistan', flag: '🇵🇰', offset: '+05:00' },

    // Oceania
    { value: 'Australia/Sydney', label: 'Sydney', country: 'Australia', flag: '🇦🇺', offset: '+10:00' },
    { value: 'Australia/Melbourne', label: 'Melbourne', country: 'Australia', flag: '🇦🇺', offset: '+10:00' },
    { value: 'Australia/Brisbane', label: 'Brisbane', country: 'Australia', flag: '🇦🇺', offset: '+10:00' },
    { value: 'Australia/Perth', label: 'Perth', country: 'Australia', flag: '🇦🇺', offset: '+08:00' },
    { value: 'Pacific/Auckland', label: 'Auckland', country: 'New Zealand', flag: '🇳🇿', offset: '+12:00' },
];

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
    selectedTimezone,
    onChange,
    show,
    onClose,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (show && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [show]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClose]);

    useEffect(() => {
        if (show && selectedTimezone && dropdownRef.current) {
            const selectedItem = dropdownRef.current.querySelector('.ntz-item[data-selected="true"]');
            if (selectedItem) {
                selectedItem.scrollIntoView({ block: 'center', behavior: 'auto' });
            }
        }
    }, [show, selectedTimezone]);

    const filteredTimezones = TIMEZONES.filter((tz) => {
        const query = searchQuery.toLowerCase();
        return (
            tz.label.toLowerCase().includes(query) ||
            tz.country.toLowerCase().includes(query) ||
            tz.value.toLowerCase().includes(query)
        );
    });

    const handleSelect = (timezone: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        onChange(timezone);
        setSearchQuery('');
        onClose();
    };

    if (!show) return null;

    return (
        <div ref={dropdownRef} style={styles.container} className="timezone-selector" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.searchBox}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search timezone or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.list}>
                {filteredTimezones.length === 0 ? (
                    <div style={styles.noResults}>No timezones found</div>
                ) : (
                    filteredTimezones.map((tz, index) => (
                        <div
                            key={tz.value}
                            className="ntz-item"
                            data-selected={tz.value === selectedTimezone}
                            style={{
                                ...styles.item,
                                ...(hoveredIndex === index ? styles.itemHovered : {}),
                                ...(tz.value === selectedTimezone ? styles.itemSelected : {}),
                            }}
                            onMouseDown={(e) => handleSelect(tz.value, e)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <span style={styles.flag}>{tz.flag}</span>
                            <div style={styles.info}>
                                <div style={styles.labelRow}>
                                    <span style={styles.label}>{tz.label}</span>
                                    <span style={styles.offset}>{tz.offset}</span>
                                </div>
                                <div style={styles.country}>{tz.country}</div>
                            </div>
                            {tz.value === selectedTimezone && (
                                <span style={styles.checkmark}>✓</span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export const getTimezoneLabel = (value: string): string => {
    const tz = TIMEZONES.find((t) => t.value === value);
    if (!tz) return value;
    // Return a much shorter label to prevent the ChipButton from expanding too much
    // on mobile screens, e.g., "UTC-05:00" or just the city name if preferred.
    // The user asked to make it short so the size of the component doesn't change.
    return `UTC${tz.offset}`;
};

export default TimezoneSelector;
