import React, { useState, useRef, useEffect } from 'react';
import { Brand } from '@models/Brand';
import { styles } from './styles';
import { theme } from '@theme/theme';

interface BrandSelectorProps {
  brands: Brand[];
  currentBrand: Brand;
  onBrandChange: (brandId: string) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({
  brands,
  currentBrand,
  onBrandChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [hoveredAddBtn, setHoveredAddBtn] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleBrandSelect = (brandId: string) => {
    onBrandChange(brandId);
    setIsOpen(false);
  };

  const handleAddBrand = () => {
    alert(
      'Directing the user to the "New Brand" page.\nIn case the user\'s subscription is insufficient - it is directed to the "Subscription Plans" page to upgrade its plan.'
    );
  };

  // Fixed selector style - explicitly set border in both states
  const selectorStyle = {
    ...styles.selector,
    // Always ensure the border is set correctly
    border: isHovered 
      ? `2px solid ${theme.colors.primary}`
      : `2px solid ${theme.colors.secondary}`,
    ...(isHovered ? {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)',
    } : {}),
  };

  const addBrandStyle = {
    ...styles.addBrand,
    ...(hoveredAddBtn ? {
      background: 'rgba(20, 184, 166, 0.05)',
      color: theme.colors.teal,
    } : {}),
  };

  return (
    <div ref={selectorRef} style={styles.container}>
      <div
        style={selectorStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
      >
        <span style={styles.tenantName}>{currentBrand.name}</span>
        <div style={styles.brandIcon}>{currentBrand.icon}</div>
      </div>

      {isOpen && (
        <div style={styles.dropdown}>
          {brands.map((brand) => {
            const isActive = brand.id === currentBrand.id;
            const isOptionHovered = hoveredOption === brand.id;

            const optionStyle = {
              ...styles.option,
              ...(isActive ? styles.optionActive : {}),
              ...(isOptionHovered && !isActive ? {
                background: theme.colors.primaryLight,
              } : {}),
            };

            return (
              <button
                key={brand.id}
                style={optionStyle}
                onClick={() => handleBrandSelect(brand.id)}
                onMouseEnter={() => setHoveredOption(brand.id)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <span style={styles.optIcon}>{brand.icon}</span>
                <span>{brand.name}</span>
              </button>
            );
          })}
          <button
            style={addBrandStyle}
            onClick={handleAddBrand}
            onMouseEnter={() => setHoveredAddBtn(true)}
            onMouseLeave={() => setHoveredAddBtn(false)}
          >
            <span style={styles.addIcon}>➕</span>
            <span>Add a new Brand</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;