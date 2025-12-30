import React, { useState, useRef, useEffect } from 'react';
import { Gender, GENDER_OPTIONS } from '@models/User';
import { styles } from './styles';

interface GenderSelectorProps {
  label: string;
  value: Gender | undefined;
  onChange: (gender: Gender | undefined) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = GENDER_OPTIONS.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (genderValue: Gender) => {
    onChange(genderValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
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
          prev < GENDER_OPTIONS.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && GENDER_OPTIONS[highlightedIndex]) {
          handleSelect(GENDER_OPTIONS[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div style={styles.container} ref={containerRef}>
      <label style={styles.label}>{label}</label>
      
      <div
        style={{
          ...styles.selectBox,
          ...(isOpen ? styles.selectBoxFocused : {}),
        }}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
      >
        <span style={selectedOption ? styles.selectedText : styles.placeholder}>
          {selectedOption ? selectedOption.label : 'Select gender'}
        </span>
      </div>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownList}>
            {GENDER_OPTIONS.map((option, index) => (
              <div
                key={option.value}
                style={{
                  ...styles.option,
                  ...(index === highlightedIndex ? styles.optionHighlighted : {}),
                  ...(option.value === value ? styles.optionSelected : {}),
                }}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenderSelector;