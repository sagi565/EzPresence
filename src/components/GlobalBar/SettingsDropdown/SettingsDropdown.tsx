import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { Sun, Moon } from 'lucide-react';
import { getLogoDataUrl } from '@models/Brand';
import { useBrands } from '@/hooks/brands/useBrands';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { useAppTheme } from '@/theme/ThemeContext';
import {
  DropdownContainer,
  ProfileHeader,
  ProfileAvatar,
  ProfileInfo,
  SectionTitle,
  BrandsList,
  BrandItem,
  BrandActions,
  ToggleRow,
  SwitchToggle,
  LogoutButton,
  Scrim,
  MobileHandle,
  MobileHeader,
  MobileTitle,
  CloseButton,
  ModalOverlay,
  SimpleModal,
  LegalLinksContainer,
  LegalLink,
  ThemeIconContainer,
  AnimatedIcon
} from './styles';
import TrashButton from '@components/Scheduler/CreateModals/TrashButton/TrashButton';

interface SettingsDropdownProps {
  onClose: () => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { brands, currentBrand, deleteBrand, setActiveBrand, loading } = useBrands();
  const { isDarkMode, toggleTheme, currentTheme } = useAppTheme();
  
  // Removed local editingBrand state to use dedicated EditBrandPage
  const [isProcessing, setIsProcessing] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);

  // Avatar Setup
  const identifier = profile?.firstName || auth.currentUser?.email || '?';
  const initial = identifier[0].toUpperCase();
  const photoURL = auth.currentUser?.photoURL || null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
    onClose();
  };


  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;
    
    setIsProcessing(true);
    try {
      await deleteBrand(brandToDelete);
      
      // Post-delete behavior: Switch to first available brand if deleted brand was active
      if (brandToDelete === currentBrand?.id && brands.length > 1) {
        const remainingBrands = brands.filter(b => b.id !== brandToDelete);
        if (remainingBrands.length > 0) {
          await setActiveBrand(remainingBrands[0].id);
        }
      }
      
      setBrandToDelete(null);
    } catch (err) {
      console.error('Failed to delete brand:', err);
      alert('Failed to delete brand.');
    }
    setIsProcessing(false);
  };

  const confirmDelete = (e: React.MouseEvent, brandId: string) => {
    e.stopPropagation();
    setBrandToDelete(brandId);
  };

  const handleEditBrand = (e: React.MouseEvent, brandId: string) => {
    e.stopPropagation();
    onClose(); // Close dropdown before navigating
    navigate(`/edit-brand/${brandId}`);
  };

  // handleSaveBrand removed as it is now handled in EditBrandPage

  return (
    <>
      <Scrim onClick={onClose} />
      <DropdownContainer onClick={(e) => e.stopPropagation()}>
        {window.innerWidth <= 600 ? null : <MobileHandle />}
        <MobileHeader>
          <MobileTitle>Settings</MobileTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </MobileHeader>

        <ProfileHeader>
          <ProfileAvatar>
            {photoURL ? <img src={photoURL} alt="User profile" /> : initial}
          </ProfileAvatar>
          <ProfileInfo>
            <div className="name">{profile?.firstName || 'User Profile'}</div>
            <div className="email">{auth.currentUser?.email}</div>
          </ProfileInfo>
        </ProfileHeader>

        <div>
          <SectionTitle>Your Active Brand</SectionTitle>
          <BrandsList>
            {loading || isProcessing ? (
              <div style={{ textAlign: 'center', padding: '10px', fontSize: '13px', color: 'gray' }}>Processing...</div>
            ) : brands.length === 0 ? (
              <div style={{ padding: '8px', fontSize: '13px', color: 'gray' }}>No brands found.</div>
            ) : (
              brands.map(brand => {
                const isActive = brand.id === currentBrand?.id;
                return (
                  <BrandItem 
                    key={brand.id} 
                    $active={isActive}
                    onClick={() => !isActive && setActiveBrand(brand.id)}
                  >
                    <div className="brand-icon" style={{ background: isActive ? currentTheme.colors.primary : 'rgba(155, 93, 229, 0.1)' }}>
                      {brand.logo ? (
                        <img src={getLogoDataUrl(brand.logo)} alt={brand.name} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : (
                        brand.icon || brand.name[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="brand-name">{brand.name}</div>
                    <BrandActions>
                      <button onClick={(e) => handleEditBrand(e, brand.id)} title="Edit">✏️</button>
                      <TrashButton 
                        className="delete" 
                        onClick={(e: React.MouseEvent) => confirmDelete(e, brand.id)} 
                        title="Delete Brand"
                      />
                    </BrandActions>
                  </BrandItem>
                );
              })
            )}
          </BrandsList>
        </div>

        <ToggleRow onClick={toggleTheme}>
          <div className="toggle-label">
            <ThemeIconContainer>
              <AnimatedIcon $active={!isDarkMode} $direction={isDarkMode ? 'down' : 'up'}>
                <Sun size={18} />
              </AnimatedIcon>
              <AnimatedIcon $active={isDarkMode} $direction={!isDarkMode ? 'down' : 'up'}>
                <Moon size={18} />
              </AnimatedIcon>
            </ThemeIconContainer>
            Dark Mode
          </div>
          <SwitchToggle $isOn={isDarkMode} />
        </ToggleRow>

        <LogoutButton onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </LogoutButton>

        <LegalLinksContainer>
          <LegalLink to="/privacy-policy" onClick={onClose}>Privacy Policy</LegalLink>
          <span className="separator">•</span>
          <LegalLink to="/terms-of-service" onClick={onClose}>Terms of Service</LegalLink>
        </LegalLinksContainer>


        {/* Local modal removed in favor of EditBrandPage */}
        
        {brandToDelete && (
          <ModalOverlay onClick={() => setBrandToDelete(null)}>
            <SimpleModal onClick={(e) => e.stopPropagation()}>
              <h3>Delete Brand?</h3>
              <p>Are you sure you want to delete this brand? This action cannot be undone and will remove all associated data.</p>
              <div className="actions">
                <button className="cancel" onClick={() => setBrandToDelete(null)}>Cancel</button>
                <button className="delete" onClick={handleDeleteBrand}>Delete</button>
              </div>
            </SimpleModal>
          </ModalOverlay>
        )}
      </DropdownContainer>
    </>
  );
};

export default SettingsDropdown;
