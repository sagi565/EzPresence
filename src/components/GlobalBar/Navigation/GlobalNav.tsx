import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styles } from './styles';
import BrandSelector from '../BrandSelector/BrandSelector';
import { signOut } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { Brand } from '@models/Brand';
import { useUserProfile } from '@/hooks/user/useUserProfile';

interface GlobalNavProps {
  brands: Brand[];
  // Fix: Allow null for initial loading state
  currentBrand: Brand | null; 
  onBrandChange: (brandId: string) => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ brands, currentBrand, onBrandChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUserProfile();
  
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [showStudioSecondary, setShowStudioSecondary] = useState(false);
  const [hoveredStudioBtn, setHoveredStudioBtn] = useState<string | null>(null);
  const studioTimeoutRef = useRef<number | null>(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '8px' }}>
          {profile && (
            <span style={styles.userName}>
              Hello, {profile.firstName}
            </span>
          )}
          
          <button
            onClick={handleLogout}
            style={{
              ...styles.logoutBtn,
              ...(isLogoutHovered ? {
                background: '#fee2e2',
                color: '#ef4444',
                borderColor: '#fecaca',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
              } : {}),
            }}
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
            title="Sign Out"
          >
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
        
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