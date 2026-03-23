import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '@lib/firebase';
import { Nav, NavLeft, Logo, NavCenter, NavItemWrapper, NavBtn, NavRight, IconBtn, Avatar } from './styles';
import BrandSelector from '../BrandSelector/BrandSelector';
import { Brand } from '@models/Brand';
import SettingsDropdown from '../SettingsDropdown/SettingsDropdown';

interface GlobalNavProps {
  brands: Brand[];
  currentBrand: Brand | null;
  onBrandChange: (brandId: string) => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ brands, currentBrand, onBrandChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

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
    const identifier = auth.currentUser?.displayName || auth.currentUser?.email || '?';
    const initial = identifier[0].toUpperCase();
    const photoURL = auth.currentUser?.photoURL || null;

    return { initial, photoURL };
  };

  const { initial: avatarInitial, photoURL } = getAvatarConfig();

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
        {/* Removing the standalone logout button since it's now inside SettingsDropdown */}


        <IconBtn
          $hovered={hoveredIcon === 'notifications'}
          onMouseEnter={() => setHoveredIcon('notifications')}
          onMouseLeave={() => setHoveredIcon(null)}
          title="Notifications"
        >
          🔔
        </IconBtn>

        <div style={{ position: 'relative' }}>
          <Avatar
            $hovered={hoveredIcon === 'profile' || showSettings}
            onMouseEnter={() => setHoveredIcon('profile')}
            onMouseLeave={() => setHoveredIcon(null)}
            title="Settings"
            onClick={() => setShowSettings(!showSettings)}
            style={{ cursor: 'pointer' }}
          >
            {photoURL ? (
              <img src={photoURL} alt="User profile" />
            ) : (
              avatarInitial
            )}
          </Avatar>
          {showSettings && (
            createPortal(<SettingsDropdown onClose={() => setShowSettings(false)} />, document.body)
          )}
        </div>
      </NavRight>
    </Nav>
  );
};

export default GlobalNav;