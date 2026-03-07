import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Nav, NavLeft, Logo, NavCenter, NavItemWrapper, NavBtn, NavRight, IconBtn, Avatar } from './styles';
import { theme } from '@theme/theme';
import BrandSelector from '../BrandSelector/BrandSelector';
import { signOut } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { Brand } from '@models/Brand';
import { useUserProfile } from '@/hooks/user/useUserProfile';

interface GlobalNavProps {
  brands: Brand[];
  currentBrand: Brand | null;
  onBrandChange: (brandId: string) => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ brands, currentBrand, onBrandChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUserProfile();

  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navButtons = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/', active: location.pathname === '/' },
    { id: 'content', icon: '▶️', label: 'Content', path: '/content', active: location.pathname === '/content' },
    { id: 'studio', icon: '🎬', label: 'Studio', path: '/studio', active: location.pathname.startsWith('/studio') },
    { id: 'scheduler', icon: '📅', label: 'Scheduler', path: '/scheduler', active: location.pathname === '/scheduler' },
    { id: 'dashboard', icon: '📊', label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const getAvatarConfig = () => {
    const identifier = profile?.firstName || auth.currentUser?.email || '?';
    const initial = identifier[0].toUpperCase();
    const color = theme.colors.primary;
    const photoURL = auth.currentUser?.photoURL || null;

    return { initial, color, photoURL };
  };

  const { initial: avatarInitial, color: avatarColor, photoURL } = getAvatarConfig();

  return (
    <Nav>
      <NavLeft>
        <Logo
          href="/"
          onClick={(e) => handleNavClick(e, '/')}
        >
          EZ<span className="logo-presence">presence</span>
        </Logo>
        <BrandSelector
          brands={brands}
          currentBrand={currentBrand}
          onBrandChange={onBrandChange}
        />
      </NavLeft>

      <NavCenter>
        {navButtons.map((btn) => (
          <NavItemWrapper key={btn.id}>
            <NavBtn
              href={btn.path}
              $active={btn.active}
              onClick={(e) => handleNavClick(e, btn.path)}
            >
              <span className="nav-icon">{btn.icon}</span>
              <span className="nav-label">{btn.label}</span>
            </NavBtn>
          </NavItemWrapper>
        ))}
      </NavCenter>

      <NavRight>
        <IconBtn
          onClick={handleLogout}
          $variant="danger"
          $hovered={isLogoutHovered}
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
        </IconBtn>

        <IconBtn
          $hovered={hoveredIcon === 'notifications'}
          onMouseEnter={() => setHoveredIcon('notifications')}
          onMouseLeave={() => setHoveredIcon(null)}
          title="Notifications"
        >
          🔔
        </IconBtn>

        <Avatar
          $bgColor={photoURL ? 'transparent' : avatarColor}
          $hovered={hoveredIcon === 'profile'}
          onMouseEnter={() => setHoveredIcon('profile')}
          onMouseLeave={() => setHoveredIcon(null)}
          title="Settings"
        >
          {photoURL ? (
            <img src={photoURL} alt="User profile" />
          ) : (
            avatarInitial
          )}
        </Avatar>
      </NavRight>
    </Nav>
  );
};

export default GlobalNav;