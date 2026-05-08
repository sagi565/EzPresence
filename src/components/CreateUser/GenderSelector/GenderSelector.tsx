import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Gender, GENDER_OPTIONS } from '@models/User';
import { styles } from './styles';

interface GenderSelectorProps {
  label: string;
  value: Gender | undefined;
  onChange: (gender: Gender | undefined) => void;
  error?: string;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = GENDER_OPTIONS.find(opt => opt.value === value);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return GENDER_OPTIONS;
    const term = searchTerm.toLowerCase();
    return GENDER_OPTIONS.filter(opt => opt.label.toLowerCase().includes(term));
  }, [searchTerm]);

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
    if (searchTerm) setHighlightedIndex(0);
  }, [searchTerm]);

  const handleSelect = (genderValue: Gender) => {
    onChange(genderValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
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
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  return (
    <div
      style={styles.container}
      ref={containerRef}
    >
      <label style={styles.label}>{label}</label>

      <div
        style={{
          ...styles.selectBox,
          ...(isOpen ? styles.selectBoxFocused : {}),
          ...(error ? { borderColor: '#ef4444' } : {}),
        }}
      >
        <input
          type="text"
          tabIndex={0}
          style={styles.searchInput}
          placeholder="Select gender"
          value={isOpen ? searchTerm : (selectedOption?.label || '')}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => {
            setIsOpen(true);
            setSearchTerm('');
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm('');
          }}
          onBlur={(e) => {
            if (!containerRef.current?.contains(e.relatedTarget as Node)) {
              setIsOpen(false);
              setSearchTerm('');
            }
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownList}>
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
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {error && (
        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default GenderSelector;
