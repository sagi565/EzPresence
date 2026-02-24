import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styles } from './styles';
import { theme } from '@theme/theme';
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
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };



  const navButtons = [
    { id: 'home', label: '🏠 Home', path: '/', active: location.pathname === '/' },
    { id: 'content', label: '▶️ Content', path: '/content', active: location.pathname === '/content' },
    { id: 'studio', label: '🎬 Studio', path: '/studio', active: location.pathname.startsWith('/studio') },
    { id: 'scheduler', label: '📅 Scheduler', path: '/scheduler', active: location.pathname === '/scheduler' },
    { id: 'dashboard', label: '📊 Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
  ];



  const getButtonStyle = (btnId: string, isActive: boolean) => ({
    ...styles.navBtn,
    ...(isActive ? styles.navBtnActive : {}),
    ...(hoveredBtn === btnId && !isActive ? { transform: 'translateY(-1px)' } : {}),
  });



  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };



  const getAvatarConfig = () => {
    const identifier = profile?.firstName || auth.currentUser?.email || '?';
    const initial = identifier[0].toUpperCase();

    // User requested purple theme color
    const color = theme.colors.primary;

    // Get photo URL from Firebase Auth (available for Google sign-in)
    const photoURL = auth.currentUser?.photoURL || null;

    return { initial, color, photoURL };
  };

  const { initial: avatarInitial, color: avatarColor, photoURL } = getAvatarConfig();

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
              href={['dashboard'].includes(btn.id) ? '#' : btn.path}
              style={getButtonStyle(btn.id, btn.active)}
              onMouseEnter={() => setHoveredBtn(btn.id)}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={(e) => {
                if (['dashboard'].includes(btn.id)) {
                  e.preventDefault();
                  return;
                }
                handleNavClick(e, btn.path);
              }}
            >
              {btn.label}
            </a>

            {['dashboard'].includes(btn.id) && (
              <span style={{
                ...styles.comingSoonBadge,
                opacity: hoveredBtn === btn.id ? 1 : 0,
                transform: hoveredBtn === btn.id ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(3px)',
              }}>Coming Soon</span>
            )}


          </div>
        ))}
      </div>

      <div style={styles.navRight}>
        <button
          onClick={handleLogout}
          style={{
            ...styles.iconBtn,
            ...(isLogoutHovered ? styles.iconBtnDangerHover : {}),
          }}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          title="Sign Out"
        >
          <svg
            width="20"
            height="20"
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

        <button
          style={{
            ...styles.iconBtn,
            ...(hoveredIcon === 'notifications' ? styles.iconBtnHover : {}),
          }}
          onMouseEnter={() => setHoveredIcon('notifications')}
          onMouseLeave={() => setHoveredIcon(null)}
          title="Notifications"
        >
          🔔
        </button>

        <button
          style={{
            ...styles.avatar,
            background: photoURL ? 'transparent' : avatarColor,
            cursor: 'default',
            ...(hoveredIcon === 'profile' ? { transform: 'scale(1.05)', transition: 'transform 0.2s' } : {}),
          }}
          onMouseEnter={() => setHoveredIcon('profile')}
          onMouseLeave={() => setHoveredIcon(null)}
          title="Settings"
          onClick={(e) => e.preventDefault()}
        >
          {photoURL ? (
            <img
              src={photoURL}
              alt="User profile"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            avatarInitial
          )}
        </button>
      </div>
    </nav>
  );
};

export default GlobalNav;