import React, { useState, useRef, useEffect, useMemo } from 'react';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { styles } from './styles';

// Register English locale
countries.registerLocale(enLocale);

interface Country {
  code: string;
  name: string;
}

interface CountrySelectorProps {
  label: string;
  value: string; // This will now receive the Country Code (e.g., "US")
  onChange: (countryCode: string) => void;
}

// Get all countries sorted alphabetically
const getAllCountries = (): Country[] => {
  const countryObj = countries.getNames('en', { select: 'official' });
  return Object.entries(countryObj)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const allCountries = getAllCountries();

// Get flag image URL from country code
const getFlagUrl = (countryCode: string): string => {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

const CountrySelector: React.FC<CountrySelectorProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Find selected country object based on the CODE stored in 'value'
  const selectedCountry = useMemo(() => {
    if (!value) return null;
    // Updated: Look for the country where the CODE matches the value
    return allCountries.find(c => c.code === value) || null;
  }, [value]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return allCountries;
    const term = searchTerm.toLowerCase();
    return allCountries.filter(c => 
      c.name.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Close dropdown when clicking outside
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

  // When dropdown opens, scroll to and highlight selected item
  useEffect(() => {
    if (isOpen && value && !searchTerm) {
      // Updated: Find index by checking the code
      const selectedIndex = filteredCountries.findIndex(c => c.code === value);
      if (selectedIndex >= 0) {
        setHighlightedIndex(selectedIndex);
        setTimeout(() => {
          if (listRef.current && listRef.current.children[selectedIndex]) {
            (listRef.current.children[selectedIndex] as HTMLElement).scrollIntoView({ block: 'center' });
          }
        }, 0);
      }
    }
  }, [isOpen, value, searchTerm, filteredCountries]); // Added dependencies for safety

  // Reset highlighted index when search changes
  useEffect(() => {
    if (searchTerm) {
      setHighlightedIndex(0);
    }
  }, [searchTerm]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (country: Country) => {
    // Updated: Pass the country.code (e.g., "US") instead of name
    onChange(country.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCountries[highlightedIndex]) {
          handleSelect(filteredCountries[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  return (
    <div style={styles.container} ref={containerRef}>
      <label style={styles.label}>{label}</label>
      
      <div
        style={{
          ...styles.inputContainer,
          ...(isOpen ? styles.inputContainerFocused : {}),
        }}
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        {selectedCountry && !isOpen ? (
          <div style={styles.selectedValue}>
            <span style={styles.countryName}>{selectedCountry.name}</span>
            <img 
              src={getFlagUrl(selectedCountry.code)} 
              alt={selectedCountry.name}
              style={styles.flagImage}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            style={styles.searchInput}
            placeholder="Select a country"
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
            {filteredCountries.length === 0 ? (
              <div style={styles.noResults}>
                No countries found
              </div>
            ) : (
              filteredCountries.map((country, index) => (
                <div
                  key={country.code}
                  style={{
                    ...styles.option,
                    ...(index === highlightedIndex ? styles.optionHighlighted : {}),
                    // Updated: Check equality by code
                    ...(country.code === value ? styles.optionSelected : {}),
                  }}
                  onClick={() => handleSelect(country)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span style={styles.optionName}>{country.name}</span>
                  <img 
                    src={getFlagUrl(country.code)} 
                    alt={country.name}
                    style={styles.optionFlag}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;