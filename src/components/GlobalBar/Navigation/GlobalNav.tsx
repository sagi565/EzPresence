import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styles } from './styles';
import BrandSelector from '../BrandSelector/BrandSelector';
import { Brand } from '@models/Brand';

interface GlobalNavProps {
  brands: Brand[];
  currentBrand: Brand;
  onBrandChange: (brandId: string) => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ brands, currentBrand, onBrandChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [showStudioSecondary, setShowStudioSecondary] = useState(false);
  const [hoveredStudioBtn, setHoveredStudioBtn] = useState<string | null>(null);
  const studioTimeoutRef = useRef<number | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (studioTimeoutRef.current) {
        clearTimeout(studioTimeoutRef.current);
      }
    };
  }, []);

  const navButtons = [
    { id: 'home', label: '🏠 Home', path: '/', active: location.pathname === '/' },
    { id: 'content', label: '▶️ Content', path: '/content', active: location.pathname === '/content' },
    { 
      id: 'studio', 
      label: '🎬 Studio', 
      path: '/studio', 
      active: location.pathname.startsWith('/studio'), 
      hasSecondary: true 
    },
    { id: 'scheduler', label: '📅 Scheduler', path: '/scheduler', active: location.pathname === '/scheduler' },
    { id: 'dashboard', label: '📊 Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
  ];

  const studioSubButtons = [
    { id: 'creators', label: '👥', text: 'Creators', path: '/studio/creators' },
    { id: 'wizard', label: '✨', text: 'Wizard', path: '/studio/wizard' },
    { id: 'producer', label: '🎯', text: 'Producer Mode', path: '/studio/producer' },
  ];

  const getButtonStyle = (btnId: string, isActive: boolean) => ({
    ...styles.navBtn,
    ...(isActive ? styles.navBtnActive : {}),
    ...(hoveredBtn === btnId && !isActive ? { transform: 'translateY(-1px)' } : {}),
  });

  const getIconStyle = (iconId: string) => ({
    ...styles.navIcon,
    ...(hoveredIcon === iconId ? { transform: 'translateY(-1px)' } : {}),
  });

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const handleStudioMouseEnter = () => {
    if (studioTimeoutRef.current) {
      clearTimeout(studioTimeoutRef.current);
    }
    setShowStudioSecondary(true);
  };

  const handleStudioMouseLeave = () => {
    studioTimeoutRef.current = window.setTimeout(() => {
      setShowStudioSecondary(false);
    }, 150);
  };

  const handleSecondaryMouseEnter = () => {
    if (studioTimeoutRef.current) {
      clearTimeout(studioTimeoutRef.current);
    }
    setShowStudioSecondary(true);
  };

  const handleSecondaryMouseLeave = () => {
    studioTimeoutRef.current = window.setTimeout(() => {
      setShowStudioSecondary(false);
    }, 150);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navLeft}>
        <a 
          href="/" 
          style={styles.logo} 
          onClick={(e) => handleNavClick(e, '/')}
        >
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
          <div
            key={btn.id}
            style={styles.navItemWrapper}
          >
            <a
              href={btn.path}
              style={getButtonStyle(btn.id, btn.active)}
              onMouseEnter={() => {
                setHoveredBtn(btn.id);
                if (btn.hasSecondary) {
                  handleStudioMouseEnter();
                }
              }}
              onMouseLeave={() => {
                setHoveredBtn(null);
                if (btn.hasSecondary) {
                  handleStudioMouseLeave();
                }
              }}
              onClick={(e) => handleNavClick(e, btn.path)}
            >
              {btn.label}
            </a>
            
            {btn.hasSecondary && (
              <nav
                style={{
                  ...styles.secondaryNav,
                  ...(showStudioSecondary ? styles.secondaryNavVisible : {}),
                }}
                onMouseEnter={handleSecondaryMouseEnter}
                onMouseLeave={handleSecondaryMouseLeave}
              >
                <div style={styles.secondaryNavItems}>
                  {studioSubButtons.map((subBtn) => {
                    const isSubActive = location.pathname === subBtn.path;
                    const isHovered = hoveredStudioBtn === subBtn.id;
                    
                    return (
                      <a
                        key={subBtn.id}
                        href={subBtn.path}
                        style={{
                          ...styles.btnSub,
                          ...(isSubActive ? styles.btnSubActive : {}),
                          ...(isHovered && !isSubActive ? styles.btnSubHover : {}),
                        }}
                        onMouseEnter={() => setHoveredStudioBtn(subBtn.id)}
                        onMouseLeave={() => setHoveredStudioBtn(null)}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(subBtn.path);
                          setShowStudioSecondary(false);
                        }}
                      >
                        <span>{subBtn.label} </span>
                        <span>{subBtn.text}</span>
                      </a>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>
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