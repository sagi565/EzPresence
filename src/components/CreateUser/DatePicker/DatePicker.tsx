import React, { useState, useRef, useEffect } from 'react';
import { styles } from './styles';

interface DatePickerProps {
  label: string;
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string) => void;
  error?: string;
  required?: boolean;
  minAge?: number;
  maxAge?: number;
}

interface DropdownProps {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: boolean;
  name?: string;
  autoComplete?: string;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  value,
  placeholder,
  options,
  onChange,
  error = false,
  name,
  autoComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Filter options based on search
  const filteredOptions = searchTerm.trim()
    ? options.filter(opt =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.value.includes(searchTerm)
    )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const element = listRef.current.children[highlightedIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
          setSearchTerm('');
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  return (
    <div style={styles.dropdownContainer} ref={containerRef}>
      <div
        style={{
          ...styles.select,
          ...(isOpen ? styles.selectFocused : {}),
          ...(error ? styles.selectError : {}),
        }}
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        {selectedOption && !isOpen ? (
          <span style={styles.selectedText}>{selectedOption.label}</span>
        ) : (
          <input
            ref={inputRef}
            type="text"
            name={name}
            autoComplete={autoComplete}
            style={styles.searchInput}
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
          />
        )}
      </div>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownList} ref={listRef}>
            {filteredOptions.length === 0 ? (
              <div style={styles.noResults}>No results</div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  style={{
                    ...styles.option,
                    ...(index === highlightedIndex ? styles.optionHighlighted : {}),
                    ...(option.value === value ? styles.optionSelected : {}),
                  }}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  minAge = 13,
  maxAge = 120,
}) => {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  // Parse external value changes (like when profile loads)
  useEffect(() => {
    if (value) {
      console.log(`🔌 [DatePicker] Received external value for parsing: "${value}"`);
      let y = '', m = '', d = '';

      // Try splitting by common delimiters (dash, slash, T for ISO, space)
      const dateParts = value.split(/[-/T ]/).filter(Boolean);

      if (dateParts.length >= 3) {
        // Check if first part is a 4-digit year (YYYY-MM-DD)
        if (dateParts[0].length === 4) {
          y = dateParts[0];
          m = dateParts[1];
          d = dateParts[2];
        }
        // Check if last part is a 4-digit year (DD-MM-YYYY)
        else if (dateParts[2].length === 4) {
          y = dateParts[2];
          m = dateParts[1];
          d = dateParts[0];
        }
      } else {
        // Fallback to native Date object if splitting failed
        const dateObj = new Date(value);
        if (!isNaN(dateObj.getTime())) {
          y = String(dateObj.getFullYear());
          m = String(dateObj.getMonth() + 1);
          d = String(dateObj.getDate());
        }
      }

      if (y && y !== year) setYear(y);

      // Month: Use 2-digit format (e.g., "03")
      const normMonth = m ? m.padStart(2, '0') : '';
      if (normMonth && normMonth !== month) setMonth(normMonth);

      // Day: Use 1-digit format for 1-9 (e.g., "3")
      const normDay = d ? String(parseInt(d, 10)) : '';
      if (normDay && normDay !== day) setDay(normDay);

      console.log(`📅 [DatePicker] Parsed -> Y:${y}, M:${normMonth}, D:${normDay}`);
    }
  }, [value]); // Only run when the external value changes manually or via profile load

  // Update parent when user fills all fields
  useEffect(() => {
    if (year && month && day) {
      const paddedDay = day.padStart(2, '0');
      const newValue = `${year}-${month}-${paddedDay}`;
      // Only notify parent if our internal date differs from external value
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  }, [year, month, day]); // Run when internal fields change

  // Generate options
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: maxAge - minAge + 1 },
    (_, i) => {
      const y = currentYear - minAge - i;
      return { value: String(y), label: String(y) };
    }
  );

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}>*</span>}
      </label>
      <div style={styles.selectGroup}>
        <CustomDropdown
          value={day}
          placeholder="Day"
          options={days}
          onChange={setDay}
          error={!!error}
          name="bday-day"
          autoComplete="bday-day"
        />
        <CustomDropdown
          value={month}
          placeholder="Month"
          options={months}
          onChange={setMonth}
          error={!!error}
          name="bday-month"
          autoComplete="bday-month"
        />
        <CustomDropdown
          value={year}
          placeholder="Year"
          options={years}
          onChange={setYear}
          error={!!error}
          name="bday-year"
          autoComplete="bday-year"
        />
      </div>
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

export default DatePicker;