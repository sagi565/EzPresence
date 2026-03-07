import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrands } from '@hooks/brands/useBrands';
import { useConnectedPlatforms } from '@hooks/platforms/useConnectedPlatforms';
import { Container, Content, Header, Title, TitleHighlight, Subtitle, Form, MainContent, Row, NameAndSloganColumn, FormGroupStacked, FormGroupRight, Label, Required, LogoCenterLabel, LogoUploadArea, LogoPreviewContainer, LogoPreview, RemoveLogoBtn, LogoUploadPlaceholder, UploadIcon, UploadText, FormGroup, Input, InputWrapper, CharCountInside, CategorySelect, ErrorText, ErrorMessageWrapper, ErrorIcon, Actions, SubmitBtn, Ripple, Spinner, BackButton } from './styles';
import SocialsBackground from '@components/Background/SocialsBackground';
import { ConnectedPlatformsGrid } from '@components/SocialPlatform/ConnectedPlatformsGrid';
import { BrandInitializeDto } from '@models/Brand';

const BRAND_CATEGORIES = [
  'Restaurant', 'Cafe', 'Retail', 'Fashion', 'Beauty', 'Fitness', 'Healthcare',
  'Technology', 'Education', 'Entertainment', 'Real Estate', 'Travel', 'Finance',
  'Consulting', 'Marketing', 'Photography', 'Art & Design', 'Food & Beverage',
  'Automotive', 'Home Services',
];

// Helper: File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const CreateBrandPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading: brandsLoading,
    getUninitializedBrand,
    createUninitializedBrand,
    initializeBrand,
  } = useBrands();

  const [formData, setFormData] = useState<{
    name: string;
    slogan: string;
    categories: string[];
    logo?: File;
  }>({
    name: '',
    slogan: '',
    categories: [],
  });

  const [uninitializedBrandId, setUninitializedBrandId] = useState<string | null>(null);

  // Fetch connected platforms
  const { platforms: connectedPlatforms, refetch: refetchPlatforms } = useConnectedPlatforms(uninitializedBrandId, true);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorError, setGlobalError] = useState<string | null>(null);

  // UI States
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        let id = await getUninitializedBrand();
        if (!id) {
          id = await createUninitializedBrand();
        }
        if (mounted) {
          setUninitializedBrandId(id);
        }
      } catch (err: any) {
        if (mounted) {
          setGlobalError(err.message || 'Failed to initialize brand session.');
        }
      }
    };

    if (!uninitializedBrandId && !brandsLoading && !errorError) {
      init();
    }

    return () => { mounted = false; };
  }, [getUninitializedBrand, createUninitializedBrand, brandsLoading, uninitializedBrandId]);

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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setNameError(true);
      return;
    }

    if (!uninitializedBrandId) {
      setGlobalError('Brand initialization failed. Please refresh the page.');
      return;
    }

    setNameError(false);
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      console.log('📤 [CreateBrand] Initializing brand:', uninitializedBrandId);

      let logoBase64: string | null = null;
      if (formData.logo) {
        logoBase64 = await fileToBase64(formData.logo);
      }

      const initData: BrandInitializeDto = {
        name: formData.name,
        slogan: formData.slogan || null,
        category: formData.categories?.[0] || null,
        // subcategory can be added later
        logoObject: logoBase64
      };

      await initializeBrand(uninitializedBrandId, initData);

      console.log('✅ [CreateBrand] Brand initialized!');
      setSubmitSuccess(true);

      // Delay for success animation before redirect
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);

    } catch (err: any) {
      console.error('❌ [CreateBrand] Failed to initialize brand:', err);
      setGlobalError(err.message || 'Failed to create brand.');
      setIsSubmitting(false);
    }
  };

  // Loading State - don't show loader if there's an error
  if ((brandsLoading || !uninitializedBrandId) && !errorError) {
    return (
      <Container>
        <SocialsBackground />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '20px',
        }}>
          <Spinner />
          <p style={{ color: '#9B5DE5', fontWeight: 500 }}>Initializing your brand session...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <SocialsBackground />

      <Content>
        {/* Back Button */}
        <BackButton
          onClick={() => navigate('/tell-us-who-you-are')}
          title="Back to profile setup"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
            <path className="arrow-group" d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
        </BackButton>

        <Header>
          <Title>
            Create Your <TitleHighlight>First Brand</TitleHighlight>
          </Title>
          <Subtitle>
            Set up your brand profile to get started!
          </Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Main Form Fields */}
          <MainContent>
            <Row>
              {/* Left Side: Name and Slogan */}
              <NameAndSloganColumn>
                {/* Name Field */}
                <FormGroupStacked>
                  <Label>
                    Brand Name <Required>*</Required>
                  </Label>
                  <InputWrapper>
                    <Input
                      type="text"
                      $isError={nameError}
                      style={{ paddingRight: '60px' }}
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
                    <CharCountInside>
                      {formData.name.length}/50
                    </CharCountInside>
                  </InputWrapper>
                  {nameError && (
                    <ErrorText>Brand name is required</ErrorText>
                  )}
                </FormGroupStacked>

                {/* Slogan Field */}
                <FormGroupStacked>
                  <Label>Slogan</Label>
                  <InputWrapper>
                    <Input
                      type="text"
                      style={{ paddingRight: '60px' }}
                      value={formData.slogan}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 60) setFormData({ ...formData, slogan: value });
                      }}
                      maxLength={60}
                    />
                    <CharCountInside>
                      {formData.slogan?.length || 0}/60
                    </CharCountInside>
                  </InputWrapper>
                </FormGroupStacked>
              </NameAndSloganColumn>

              {/* Logo Upload */}
              <FormGroupRight>
                <LogoCenterLabel>Brand Logo</LogoCenterLabel>
                <LogoUploadArea>
                  {logoPreview ? (
                    <LogoPreviewContainer>
                      <LogoPreview src={logoPreview} alt="Logo preview" />
                      <RemoveLogoBtn
                        type="button"
                        onClick={handleRemoveLogo}
                      >
                        ✕
                      </RemoveLogoBtn>
                    </LogoPreviewContainer>
                  ) : (
                    <LogoUploadPlaceholder
                      $isHovered={isLogoHovered}
                      onClick={() => fileInputRef.current?.click()}
                      onMouseEnter={() => setIsLogoHovered(true)}
                      onMouseLeave={() => setIsLogoHovered(false)}
                    >
                      <UploadIcon>📷</UploadIcon>
                      <UploadText>Upload</UploadText>
                    </LogoUploadPlaceholder>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleLogoUpload}
                  />
                </LogoUploadArea>
              </FormGroupRight>
            </Row>

            {/* Category */}
            <FormGroup>
              <Label>Category</Label>
              <CategorySelect
                value={formData.categories?.[0] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, categories: value ? [value] : [] });
                }}
              >
                <option value="">-- Select a category --</option>
                {BRAND_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </CategorySelect>
            </FormGroup>
          </MainContent>

          {/* Social Media Connections - Pass uninitializedBrandUuid */}
          <ConnectedPlatformsGrid
            connectedPlatforms={connectedPlatforms}
            onConnectionChange={refetchPlatforms}
            isUninitializedBrand={true}
            uninitializedBrandId={uninitializedBrandId!}
          />

          {/* Messages */}
          {errorError && (
            <ErrorMessageWrapper>
              <ErrorIcon>⚠️</ErrorIcon>
              <span>{errorError}</span>
            </ErrorMessageWrapper>
          )}

          {submitSuccess && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
              background: 'rgba(20, 184, 166, 0.1)', border: '2px solid #14b8a6',
              borderRadius: '12px', color: '#14b8a6', fontSize: '14px', fontWeight: 500,
            }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <span>Brand created successfully! Redirecting...</span>
            </div>
          )}

          {/* Submit Button */}
          <Actions>
            <SubmitBtn
              type="submit"
              disabled={isSubmitting || submitSuccess}
              $isSubmitting={isSubmitting || submitSuccess}
              $isHovered={isButtonHovered}
              $isActive={isButtonActive}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => { setIsButtonHovered(false); setIsButtonActive(false); }}
              onMouseDown={() => { setIsButtonActive(true); setShowRipple(true); setTimeout(() => setShowRipple(false), 600); }}
              onMouseUp={() => setIsButtonActive(false)}
            >
              {showRipple && <Ripple />}
              {isSubmitting ? 'Creating...' : submitSuccess ? 'Success!' : 'Create Brand'}
            </SubmitBtn>
          </Actions>
        </Form>
      </Content>
    </Container>
  );
};

export default CreateBrandPage;