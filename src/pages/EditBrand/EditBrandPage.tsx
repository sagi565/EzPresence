import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { useBrands } from '@hooks/brands/useBrands';
import { useConnectedPlatforms } from '@hooks/platforms/useConnectedPlatforms';
import { Container, Content, Header, Title, TitleHighlight, Subtitle, Form, MainContent, Row, NameAndSloganColumn, FormGroupStacked, Label, Required, LogoCenterLabel, LogoUploadArea, LogoPreviewContainer, LogoPreview, RemoveLogoBtn, LogoUploadPlaceholder, UploadIcon, UploadText, FormGroup, Input, InputWrapper, CharCountInside, CategorySelect, ErrorText, ErrorMessageWrapper, ErrorIcon, Actions, SubmitBtn, Ripple, Spinner, BackButton, FormGroupRight, LogoAndPickerRow, PickerRightWrapper, SuggestionOverlay, SuggestionModal, SuggestionModalAvatar, SuggestionModalBadge, SuggestionModalTitle, SuggestionModalSub, SuggestionModalActions, SuggestionModalAcceptBtn, SuggestionModalDeclineBtn } from '@components/Brand/BrandSetupForm/styles';
import { ConnectedPlatformsGrid } from '@components/SocialPlatform/ConnectedPlatformsGrid';
import PlatformLogoPicker from '@components/Brand/PlatformLogoPicker/PlatformLogoPicker';
import { BrandInitializeDto, getLogoDataUrl } from '@models/Brand';
import { ConnectedPlatform, getPlatformIconPath } from '@/models/Platform';
import { SocialPlatform } from '@models/SocialAccount';
import { urlToBase64 } from '@utils/imageUtils';

const BRAND_CATEGORIES = [
  'Restaurant', 'Cafe', 'Retail', 'Fashion', 'Beauty', 'Fitness', 'Healthcare',
  'Technology', 'Education', 'Entertainment', 'Real Estate', 'Travel', 'Finance',
  'Consulting', 'Marketing', 'Photography', 'Art & Design', 'Food & Beverage',
  'Automotive', 'Home Services',
];

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

const EditBrandPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { brands, editBrand, loading: brandsLoading } = useBrands();

  const [formData, setFormData] = useState<{
    name: string;
    slogan: string;
    categories: string[];
    logo?: File;
    logoBase64?: string;
    logoSource?: { type: 'file'; file: File } | { type: 'platform'; platform: SocialPlatform };
  }>({
    name: '',
    slogan: '',
    categories: [],
  });

  const { platforms: connectedPlatforms, refetch: refetchPlatforms, loading: platformsLoading } = useConnectedPlatforms(id, false);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [suggestionCp, setSuggestionCp] = useState<ConnectedPlatform | null>(null);
  const [convertingPlatform, setConvertingPlatform] = useState<SocialPlatform | null>(null);

  const OFFERED_KEY = 'ezp_logo_offered_platforms_edit';
  const prevConnectedRef = useRef<SocialPlatform[]>([]);
  const didInitRef = useRef(false);
  const offeredRef = useRef<Set<SocialPlatform>>(
    new Set(JSON.parse(sessionStorage.getItem(OFFERED_KEY) || '[]') as SocialPlatform[])
  );
  const logoBase64Ref = useRef<string | undefined>(undefined);
  const [nameError, setNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (brands.length > 0 && id) {
      const brand = brands.find(b => b.id === id);
      if (brand) {
        setFormData(prev => ({
          ...prev,
          name: brand.name,
          slogan: brand.slogan || '',
          categories: brand.category ? [brand.category] : [],
        }));
        if (brand.logo) {
          setLogoPreview(getLogoDataUrl(brand.logo) || null);
        }
      } else if (!brandsLoading) {
        setGlobalError('Brand not found.');
      }
    }
  }, [brands, id, brandsLoading]);

  useEffect(() => {
    logoBase64Ref.current = formData.logoBase64 || logoPreview || undefined;
    if (!logoBase64Ref.current) {
      offeredRef.current = new Set();
      sessionStorage.removeItem(OFFERED_KEY);
    }
  }, [formData.logoBase64, logoPreview]);

  useEffect(() => {
    if (platformsLoading) return;

    const current = connectedPlatforms
      .filter(p => p.isConnected && !!p.profilePicture)
      .map(p => p.platform);

    if (!didInitRef.current) {
      prevConnectedRef.current = current;
      didInitRef.current = true;
      return;
    }

    if (!logoBase64Ref.current) {
      const newPlatform = current.find(
        p => !prevConnectedRef.current.includes(p) && !offeredRef.current.has(p)
      );
      if (newPlatform) {
        const cp = connectedPlatforms.find(p => p.platform === newPlatform);
        if (cp) {
          offeredRef.current.add(newPlatform);
          sessionStorage.setItem(OFFERED_KEY, JSON.stringify([...offeredRef.current]));
          setSuggestionCp(cp);
        }
      }
    }

    prevConnectedRef.current = current;
  }, [connectedPlatforms, platformsLoading]);

  useEffect(() => {
    if ((formData.logoBase64 || logoPreview) && suggestionCp) setSuggestionCp(null);
  }, [formData.logoBase64, logoPreview, suggestionCp]);

  const handleSuggestionDecline = () => setSuggestionCp(null);

  const handlePlatformPicSelect = async (cp: ConnectedPlatform) => {
    if (!cp.profilePicture) return;
    setConvertingPlatform(cp.platform);
    try {
      const base64 = await urlToBase64(cp.profilePicture);
      setFormData(prev => ({
        ...prev,
        logo: undefined,
        logoBase64: base64,
        logoSource: { type: 'platform', platform: cp.platform }
      }));
      setLogoPreview(getLogoDataUrl(base64));
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      // ignore
    } finally {
      setConvertingPlatform(null);
      setSuggestionCp(null);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, logo: file, logoBase64: undefined, logoSource: { type: 'file', file } });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: undefined, logoBase64: undefined, logoSource: undefined });
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setNameError(true);
      return;
    }

    if (!id) return;

    setNameError(false);
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      let logoBase64: string | null = null;
      if (formData.logo) {
        logoBase64 = await fileToBase64(formData.logo);
      } else if (formData.logoBase64) {
        logoBase64 = formData.logoBase64;
      }

      const updateData: Partial<BrandInitializeDto> = {
        name: formData.name,
        slogan: formData.slogan || null,
        category: formData.categories?.[0] || null,
        logoObject: logoBase64
      };

      await editBrand(id, updateData);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setGlobalError(err.message || 'Failed to update brand.');
      setIsSubmitting(false);
    }
  };

  if (brandsLoading && brands.length === 0) {
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spinner />
        </div>
      </Container>
    );
  }

  const selectedPlatform = formData.logoSource?.type === 'platform' ? formData.logoSource.platform : null;

  return (
    <Container>
      {suggestionCp && (
        <SuggestionOverlay onClick={handleSuggestionDecline}>
          <SuggestionModal onClick={(e) => e.stopPropagation()}>
            <SuggestionModalAvatar>
              <img src={suggestionCp.profilePicture!} alt={suggestionCp.username} />
              <SuggestionModalBadge
                src={getPlatformIconPath(suggestionCp.platform)}
                alt={suggestionCp.platform}
              />
            </SuggestionModalAvatar>
            <SuggestionModalTitle>{suggestionCp.username}</SuggestionModalTitle>
            <SuggestionModalSub>Use as brand logo?</SuggestionModalSub>
            <SuggestionModalActions>
              <SuggestionModalAcceptBtn
                type="button"
                onClick={() => handlePlatformPicSelect(suggestionCp)}
                disabled={convertingPlatform === suggestionCp.platform}
              >
                {convertingPlatform === suggestionCp.platform ? 'Loading…' : 'Use it'}
              </SuggestionModalAcceptBtn>
              <SuggestionModalDeclineBtn type="button" onClick={handleSuggestionDecline}>
                Skip
              </SuggestionModalDeclineBtn>
            </SuggestionModalActions>
          </SuggestionModal>
        </SuggestionOverlay>
      )}

      <Content>
        <BackButton
          onClick={() => navigate('/')}
          title="Back to home"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
            <path className="arrow-group" d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
        </BackButton>

        <Header>
          <Title>
            Edit <TitleHighlight>Brand</TitleHighlight>
          </Title>
          <Subtitle>Update your brand profile and connected platforms</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <MainContent>
            <Row>
              <NameAndSloganColumn>
                <FormGroupStacked>
                  <Label>Brand Name <Required>*</Required></Label>
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
                    <CharCountInside>{formData.name.length}/50</CharCountInside>
                  </InputWrapper>
                  {nameError && <ErrorText>Brand name is required</ErrorText>}
                </FormGroupStacked>

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
                    <CharCountInside>{formData.slogan.length}/60</CharCountInside>
                  </InputWrapper>
                </FormGroupStacked>
              </NameAndSloganColumn>

              <FormGroupRight>
                <LogoCenterLabel>Brand Logo</LogoCenterLabel>
                <LogoAndPickerRow>
                  <LogoUploadArea>
                    {logoPreview ? (
                      <LogoPreviewContainer>
                        <LogoPreview src={logoPreview} alt="Logo preview" />
                        <RemoveLogoBtn type="button" onClick={handleRemoveLogo} title="Remove logo">
                          <X size={12} strokeWidth={2.5} />
                        </RemoveLogoBtn>
                      </LogoPreviewContainer>
                    ) : (
                      <LogoUploadPlaceholder
                        $isHovered={isLogoHovered}
                        onClick={() => fileInputRef.current?.click()}
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                      >
                        <UploadIcon>
                          <Upload size={48} strokeWidth={1.75} />
                        </UploadIcon>
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
                  <PickerRightWrapper>
                    <PlatformLogoPicker
                      connectedPlatforms={connectedPlatforms}
                      selectedPlatform={selectedPlatform}
                      onSelect={handlePlatformPicSelect}
                      convertingPlatform={convertingPlatform}
                    />
                  </PickerRightWrapper>
                </LogoAndPickerRow>
              </FormGroupRight>
            </Row>

            <FormGroup>
              <Label>Category</Label>
              <CategorySelect
                value={formData.categories?.[0] || ''}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value ? [e.target.value] : [] })}
              >
                <option value="">-- Select a category --</option>
                {BRAND_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </CategorySelect>
            </FormGroup>
          </MainContent>

          <ConnectedPlatformsGrid
            connectedPlatforms={connectedPlatforms}
            onConnectionChange={refetchPlatforms}
            isUninitializedBrand={false}
            brandId={id!}
          />

          {globalError && (
            <ErrorMessageWrapper>
              <ErrorIcon>⚠️</ErrorIcon>
              <span>{globalError}</span>
            </ErrorMessageWrapper>
          )}

          {submitSuccess && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
              background: 'rgba(20, 184, 166, 0.1)', border: '2px solid #14b8a6',
              borderRadius: '12px', color: '#14b8a6', fontSize: '14px', fontWeight: 500,
            }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <span>Brand updated successfully! Redirecting...</span>
            </div>
          )}

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
              {isSubmitting ? 'Updating...' : submitSuccess ? 'Success!' : 'Save Changes'}
            </SubmitBtn>
          </Actions>
        </Form>
      </Content>
    </Container>
  );
};

export default EditBrandPage;
