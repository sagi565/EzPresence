import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostBrand, CreateBrandData } from '@hooks/brands/usePostBrand';
import { useBrands } from '@hooks/brands/useBrands';
import SocialsBackground from '@components/Background/SocialsBackground';
import { CompactSocialButton } from '@components/SocialPlatform/SocialConnection/CompactSocialButton';
import { SocialPlatform } from '@models/SocialAccount';
import { styles } from './styles';

const BRAND_CATEGORIES = [
  'Restaurant',
  'Cafe',
  'Retail',
  'Fashion',
  'Beauty',
  'Fitness',
  'Healthcare',
  'Technology',
  'Education',
  'Entertainment',
  'Real Estate',
  'Travel',
  'Finance',
  'Consulting',
  'Marketing',
  'Photography',
  'Art & Design',
  'Food & Beverage',
  'Automotive',
  'Home Services',
];

// Add CSS animations and import Playfair Display font
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes adjectiveHover {
    0% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0); }
  }
  
  select {
    position: relative;
  }
  
  select option {
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 500;
    background: white;
    color: #333;
    border-bottom: 1px solid rgba(155, 93, 229, 0.1);
  }
  
  select option:hover {
    background: rgba(155, 93, 229, 0.08);
    color: #9B5DE5;
  }
  
  select option:checked {
    background: linear-gradient(135deg, rgba(155, 93, 229, 0.15), rgba(155, 93, 229, 0.08));
    color: #9B5DE5;
    font-weight: 600;
  }
  
  select:hover {
    border-color: rgba(155, 93, 229, 0.5);
  }
  
  select:focus {
    border-color: #9B5DE5;
    box-shadow: 0 0 0 3px rgba(155, 93, 229, 0.1);
  }
`;
if (!document.head.querySelector('style[data-create-brand-animations]')) {
  styleSheet.setAttribute('data-create-brand-animations', 'true');
  document.head.appendChild(styleSheet);
}

const CreateBrandPage: React.FC = () => {
  const navigate = useNavigate();
  const { createBrand, loading, error } = usePostBrand();
  const { refetchBrands } = useBrands();
  
  const [formData, setFormData] = useState<CreateBrandData>({
    name: '',
    slogan: '',
    categories: [],
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSubmitting && !loading) {
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      setFormData({ ...formData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: undefined });
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setNameError(true);
      return;
    }
    
    setNameError(false);
    setIsSubmitting(true);
    
    try {
      // Create the brand and set it as active (using setActive=true query param)
      const newBrand = await createBrand(formData);
      console.log('✅ Brand created successfully:', newBrand);
      
      // Show success state briefly
      setSubmitSuccess(true);
      
      // Refetch brands to update the list and wait for it to complete
      await refetchBrands();
      
      // Small delay to ensure state is fully updated, then navigate with replace
      setTimeout(() => {
        navigate('/scheduler', { replace: true });
      }, 300);
      
    } catch (err) {
      console.error('Failed to create brand:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <SocialsBackground />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            Create Your <span style={styles.titleHighlight}>First Brand</span>
          </h1>
          <p style={styles.subtitle}>
            Set up your brand profile to get started!
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {/* Brand Information - Full Width */}
          <div style={styles.mainContent}>
              {/* Row 1: Name, Slogan, and Logo */}
              <div style={styles.row}>
                {/* Left Side: Name and Slogan */}
                <div style={styles.nameAndSloganColumn}>
                  {/* Name Field */}
                  <div style={styles.formGroupStacked}>
                    <label style={styles.label}>
                      Brand Name <span style={styles.required}>*</span>
                    </label>
                    <div style={styles.inputWrapper}>
                      <input
                        type="text"
                        style={{
                          ...styles.input,
                          ...(nameError ? styles.inputError : {}),
                          paddingRight: '60px',
                        }}
                        placeholder=""
                        value={formData.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 50) {
                            setFormData({ ...formData, name: value });
                            setNameError(false);
                          }
                        }}
                        maxLength={50}
                      />
                      <span style={styles.charCountInside}>
                        {formData.name.length}/50
                      </span>
                    </div>
                    {nameError && (
                      <span style={styles.errorText}>Brand name is required</span>
                    )}
                  </div>

                  {/* Slogan Field - Under Name */}
                  <div style={styles.formGroupStacked}>
                    <label style={styles.label}>Slogan</label>
                    <div style={styles.inputWrapper}>
                      <input
                        type="text"
                        style={{
                          ...styles.input,
                          paddingRight: '60px',
                        }}
                        placeholder=""
                        value={formData.slogan}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 60) {
                            setFormData({ ...formData, slogan: value });
                          }
                        }}
                        maxLength={60}
                      />
                      <span style={styles.charCountInside}>
                        {formData.slogan?.length || 0}/60
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div style={styles.formGroupRight}>
                  <label style={styles.logoCenterLabel}>Brand Logo</label>
                  <div style={styles.logoUploadArea}>
                    {logoPreview ? (
                      <div style={styles.logoPreviewContainer}>
                        <img src={logoPreview} alt="Logo preview" style={styles.logoPreview} />
                        <button
                          type="button"
                          style={styles.removeLogoBtn}
                          onClick={handleRemoveLogo}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          ...styles.logoUploadPlaceholder,
                          ...(isLogoHovered ? styles.logoUploadPlaceholderHover : {}),
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                      >
                        <span style={styles.uploadIcon}>📷</span>
                        <span style={styles.uploadText}>Upload</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={styles.hiddenInput}
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Category (Dropdown) */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                
                <select
                  style={styles.categorySelect}
                  value={formData.categories?.[0] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      categories: value ? [value] : [],
                    });
                  }}
                >
                  <option value="">-- Select a category --</option>
                  {BRAND_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          {/* Social Media Connections Section - Bottom */}
          <div style={styles.socialSectionBottom}>
            <div style={styles.socialHeaderBottom}>
              <h2 style={styles.socialTitleBottom}>Connect Social Medias</h2>
              <p style={styles.socialSubtitleBottom}>Link your social accounts to grow your presence</p>
            </div>

            <div style={styles.socialGridBottom}>
              {(['instagram', 'facebook', 'tiktok', 'youtube'] as SocialPlatform[]).map((platform) => (
                <CompactSocialButton
                  key={platform}
                  platform={platform}
                  brandId="temp-brand-id"
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 18px',
              background: 'rgba(20, 184, 166, 0.1)',
              border: '2px solid #14b8a6',
              borderRadius: '12px',
              color: '#14b8a6',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <span>Brand created successfully! Redirecting...</span>
            </div>
          )}

          {/* Action Button */}
          <div style={styles.actions}>
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(isSubmitting || submitSuccess ? styles.submitBtnLoading : {}),
                ...(isButtonHovered && !isSubmitting ? styles.submitBtnHover : {}),
                ...(isButtonActive && !isSubmitting ? styles.submitBtnActive : {}),
              }}
              disabled={loading || isSubmitting || submitSuccess}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => {
                setIsButtonHovered(false);
                setIsButtonActive(false);
              }}
              onMouseDown={(e) => {
                setIsButtonActive(true);
                handleButtonClick(e);
              }}
              onMouseUp={() => setIsButtonActive(false)}
            >
              {showRipple && (
                <span
                  style={{
                    position: 'absolute',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.6)',
                    animation: 'ripple 0.6s ease-out',
                    pointerEvents: 'none',
                  }}
                />
              )}
              {isSubmitting ? (
                <>
                  <span style={styles.spinner} />
                  Creating...
                </>
              ) : submitSuccess ? (
                <>
                  <span>✅</span>
                  Success!
                </>
              ) : (
                'Create Brand'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrandPage;