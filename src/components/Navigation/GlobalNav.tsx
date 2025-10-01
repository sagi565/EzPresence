import React, { useState } from 'react';
import { styles } from './styles';
import BrandSelector from '../BrandSelector/BrandSelector';
import { Brand } from '@models/Brand';
import { theme } from '@theme/theme';

interface GlobalNavProps {
  brands: Brand[];
  currentBrand: Brand;
  onBrandChange: (brandId: string) => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ brands, currentBrand, onBrandChange }) => {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const navButtons = [
    { id: 'home', label: '🏠 Home', active: false },
    { id: 'content', label: '▶️ Content', active: false },
    { id: 'studio', label: '🎬 Studio', active: false },
    { id: 'scheduler', label: '📅 Scheduler', active: true },
    { id: 'dashboard', label: '📊 Dashboard', active: false },
  ];

  const getButtonStyle = (btnId: string, isActive: boolean) => ({
    ...styles.navBtn,
    ...(isActive ? styles.navBtnActive : {}),
    ...(hoveredBtn === btnId && !isActive ? {
      transform: 'translateY(-1px)',
    } : {}),
  });

  const getIconStyle = (iconId: string) => ({
    ...styles.navIcon,
    ...(hoveredIcon === iconId ? {
      transform: 'translateY(-1px)',
    } : {}),
  });

  return (
    <nav style={styles.nav}>
      <div style={styles.navLeft}>
        <a href="#" style={styles.logo}>
          EZpresence
        </a>
        <BrandSelector
          brands={brands}
          currentBrand={currentBrand}
          onBrandChange={onBrandChange}
        />
      </div>

      <div style={styles.navCenter}>
        {navButtons.map((btn) => (
          <a
            key={btn.id}
            href="#"
            style={getButtonStyle(btn.id, btn.active)}
            onMouseEnter={() => setHoveredBtn(btn.id)}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {btn.label}
          </a>
        ))}
      </div>

      <div style={styles.navRight}>
        <button
          style={getIconStyle('notifications')}
          onMouseEnter={() => setHoveredIcon('notifications')}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          🔔
        </button>
        <button
          style={getIconStyle('profile')}
          onMouseEnter={() => setHoveredIcon('profile')}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          👤
        </button>
      </div>
    </nav>
  );
};

export default GlobalNav;