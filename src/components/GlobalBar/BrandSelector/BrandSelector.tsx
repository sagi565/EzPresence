import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand, getLogoDataUrl } from '@models/Brand';
import { Container, Selector, TenantName, BrandIcon, Dropdown, Option, OptIcon, AddBrandBtn, AddIcon, LogoImage } from './styles';

interface BrandSelectorProps {
  brands: Brand[];
  currentBrand: Brand | null;
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
  const navigate = useNavigate();

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

  if (!currentBrand) {
    return (
      <Container>
        <Selector $isHovered={false} style={{ opacity: 0.7, cursor: 'wait' }}>
          <TenantName>Loading...</TenantName>
        </Selector>
      </Container>
    );
  }

  const handleBrandSelect = (brandId: string) => {
    onBrandChange(brandId);
    setIsOpen(false);
  };

  const handleAddBrand = () => {
    navigate('/create-new-brand');
  };

  const currentBrandLogo = getLogoDataUrl(currentBrand.logo);

  return (
    <Container ref={selectorRef}>
      <Selector
        $isHovered={isHovered}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
      >
        <TenantName>{currentBrand.name}</TenantName>
        <BrandIcon>
          {currentBrandLogo ? (
            <LogoImage
              src={currentBrandLogo}
              alt={`${currentBrand.name} logo`}
            />
          ) : (
            currentBrand.icon
          )}
        </BrandIcon>
      </Selector>

      {isOpen && (
        <Dropdown>
          {brands.map((brand) => {
            const isActive = brand.id === currentBrand.id;
            const isOptionHovered = hoveredOption === brand.id;
            const brandLogo = getLogoDataUrl(brand.logo);

            return (
              <Option
                key={brand.id}
                $isActive={isActive}
                $isHovered={isOptionHovered}
                onClick={() => handleBrandSelect(brand.id)}
                onMouseEnter={() => setHoveredOption(brand.id)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <OptIcon>
                  {brandLogo ? (
                    <LogoImage
                      src={brandLogo}
                      alt={`${brand.name} logo`}
                    />
                  ) : (
                    brand.icon
                  )}
                </OptIcon>
                <span>{brand.name}</span>
              </Option>
            );
          })}
          <AddBrandBtn
            $isHovered={hoveredAddBtn}
            onClick={handleAddBrand}
            onMouseEnter={() => setHoveredAddBtn(true)}
            onMouseLeave={() => setHoveredAddBtn(false)}
          >
            <AddIcon>➕</AddIcon>
            <span>Add a new Brand</span>
          </AddBrandBtn>
        </Dropdown>
      )}
    </Container>
  );
};

export default BrandSelector;