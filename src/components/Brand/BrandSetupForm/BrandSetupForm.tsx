import React, { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { useBrands } from '@hooks/brands/useBrands';
import { useConnectedPlatforms } from '@hooks/platforms/useConnectedPlatforms';
import { ConnectedPlatformsGrid } from '@components/SocialPlatform/ConnectedPlatformsGrid';
import SocialsBackground from '@components/Background/SocialsBackground';
import PlatformLogoPicker from '@components/Brand/PlatformLogoPicker/PlatformLogoPicker';
import { BrandInitializeDto, getLogoDataUrl } from '@models/Brand';
import { ConnectedPlatform, getPlatformIconPath } from '@/models/Platform';
import { SocialPlatform } from '@models/SocialAccount';
import { fileToBase64 } from '@utils/fileUtils';
import { urlToBase64 } from '@utils/imageUtils';
import {
  Container, Content, Header, Title, TitleHighlight, Subtitle, Form, MainContent,
  Row, NameAndSloganColumn, FormGroupStacked, FormGroupRight, Label, Required,
  LogoCenterLabel, LogoUploadArea, LogoAndPickerRow, PickerRightWrapper,
  LogoPreviewContainer, LogoPreview, RemoveLogoBtn, LogoUploadPlaceholder,
  UploadIcon, UploadText, FormGroup, Input, InputWrapper, CharCountInside,
  CategorySelect, ErrorText, ErrorMessageWrapper, ErrorIcon, Actions, SubmitBtn,
  Ripple, Spinner, BackButton, LoadingContainer, SuccessMessage,
  SuggestionOverlay, SuggestionModal, SuggestionModalAvatar, SuggestionModalBadge,
  SuggestionModalTitle, SuggestionModalSub, SuggestionModalActions,
  SuggestionModalAcceptBtn, SuggestionModalDeclineBtn,
} from './styles';

const BRAND_CATEGORIES = [
  'Restaurant', 'Cafe', 'Retail', 'Fashion', 'Beauty', 'Fitness', 'Healthcare',
  'Technology', 'Education', 'Entertainment', 'Real Estate', 'Travel', 'Finance',
  'Consulting', 'Marketing', 'Photography', 'Art & Design', 'Food & Beverage',
  'Automotive', 'Home Services',
];

type LogoSource =
  | { type: 'file'; file: File }
  | { type: 'platform'; platform: SocialPlatform };

interface FormData {
  name: string;
  slogan: string;
  categories: string[];
  logoBase64?: string;
  logoPreview?: string;
  logoSource?: LogoSource;
}

export type BrandSetupFormVariant = 'first' | 'additional';

interface BrandSetupFormProps {
  variant: BrandSetupFormVariant;
  onBack: () => void;
  onSuccess: () => void;
  showBackground?: boolean;
}

const BrandSetupForm: React.FC<BrandSetupFormProps> = ({
  variant,
  onBack,
  onSuccess,
  showBackground = false,
}) => {
  const {
    loading: brandsLoading,
    getUninitializedBrand,
    createUninitializedBrand,
    initializeBrand,
  } = useBrands();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slogan: '',
    categories: [],
  });

  const [uninitializedBrandId, setUninitializedBrandId] = useState<string | null>(null);
  const { platforms: connectedPlatforms, refetch: refetchPlatforms } =
    useConnectedPlatforms(uninitializedBrandId, true);

  const [nameError, setNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorError, setGlobalError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [convertingPlatform, setConvertingPlatform] = useState<SocialPlatform | null>(null);

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Connection suggestion
  const OFFERED_KEY = 'ezp_logo_offered_platforms';
  const prevConnectedRef = useRef<SocialPlatform[]>([]);
  const didInitRef = useRef(false);
  const offeredRef = useRef<Set<SocialPlatform>>(
    new Set(JSON.parse(sessionStorage.getItem(OFFERED_KEY) || '[]') as SocialPlatform[])
  );
  const logoBase64Ref = useRef<string | undefined>(undefined);
  const [suggestionCp, setSuggestionCp] = useState<ConnectedPlatform | null>(null);

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
  }, [getUninitializedBrand, createUninitializedBrand, brandsLoading, uninitializedBrandId, errorError]);

  // Keep logo ref in sync; reset offered platforms when logo is removed so they can suggest again
  useEffect(() => {
    logoBase64Ref.current = formData.logoBase64;
    if (!formData.logoBase64) {
      offeredRef.current = new Set();
      sessionStorage.removeItem(OFFERED_KEY);
    }
  }, [formData.logoBase64]);

  // Detect newly-connected platform → show suggestion if no logo selected
  useEffect(() => {
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
  }, [connectedPlatforms]);

  // Close popup if a logo gets set while it's open
  useEffect(() => {
    if (formData.logoBase64 && suggestionCp) setSuggestionCp(null);
  }, [formData.logoBase64, suggestionCp]);

  const handleSuggestionDecline = () => setSuggestionCp(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => {
        if (prev.logoPreview && prev.logoSource?.type === 'file') {
          URL.revokeObjectURL(prev.logoPreview);
        }
        return {
          ...prev,
          logoBase64: base64,
          logoPreview: URL.createObjectURL(file),
          logoSource: { type: 'file', file },
        };
      });
      setLogoError(null);
    } catch {
      setLogoError("Couldn't read that file. Please try another image.");
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => {
      if (prev.logoPreview && prev.logoSource?.type === 'file') {
        URL.revokeObjectURL(prev.logoPreview);
      }
      return {
        ...prev,
        logoBase64: undefined,
        logoPreview: undefined,
        logoSource: undefined,
      };
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLogoError(null);
  };

  const handlePlatformPicSelect = async (cp: ConnectedPlatform) => {
    if (!cp.profilePicture) return;
    setConvertingPlatform(cp.platform);
    setLogoError(null);
    try {
      const base64 = await urlToBase64(cp.profilePicture);
      setFormData(prev => {
        if (prev.logoPreview && prev.logoSource?.type === 'file') {
          URL.revokeObjectURL(prev.logoPreview);
        }
        return {
          ...prev,
          logoBase64: base64,
          logoPreview: getLogoDataUrl(base64),
          logoSource: { type: 'platform', platform: cp.platform },
        };
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setLogoError("Couldn't use that profile picture. Please upload a logo instead.");
    } finally {
      setConvertingPlatform(null);
      setSuggestionCp(null);
    }
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
      const initData: BrandInitializeDto = {
        name: formData.name,
        slogan: formData.slogan || null,
        category: formData.categories?.[0] || null,
        logoObject: formData.logoBase64 ?? null,
      };

      await initializeBrand(uninitializedBrandId, initData);
      setSubmitSuccess(true);

      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      setGlobalError(err.message || 'Failed to create brand.');
      setIsSubmitting(false);
    }
  };

  const titleMain = variant === 'first' ? 'Create Your ' : 'Create ';
  const titleHighlight = variant === 'first' ? 'First Brand' : 'New Brand';
  const backTitle = variant === 'first' ? 'Back to profile setup' : 'Back to home';

  if ((brandsLoading || !uninitializedBrandId) && !errorError) {
    return (
      <Container>
        {showBackground && <SocialsBackground />}
        <LoadingContainer>
          <Spinner />
          <p>Initializing your brand session...</p>
        </LoadingContainer>
      </Container>
    );
  }

  const selectedPlatform =
    formData.logoSource?.type === 'platform' ? formData.logoSource.platform : null;

  return (
    <Container>
      {showBackground && <SocialsBackground />}

      {suggestionCp && (
        <SuggestionOverlay>
          <SuggestionModal>
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
        <BackButton onClick={onBack} title={backTitle} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
            <path className="arrow-group" d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
        </BackButton>

        <Header>
          <Title>
            {titleMain}<TitleHighlight>{titleHighlight}</TitleHighlight>
          </Title>
          <Subtitle>Set up your brand profile to get started!</Subtitle>
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
                    <CharCountInside>{formData.slogan?.length || 0}/60</CharCountInside>
                  </InputWrapper>
                </FormGroupStacked>
              </NameAndSloganColumn>

              <FormGroupRight>
                <LogoCenterLabel>Brand Logo</LogoCenterLabel>
                <LogoAndPickerRow>
                  <LogoUploadArea>
                    {formData.logoPreview ? (
                      <LogoPreviewContainer>
                        <LogoPreview src={formData.logoPreview} alt="Logo preview" />
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
                {logoError && <ErrorText>{logoError}</ErrorText>}
              </FormGroupRight>
            </Row>

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

          <ConnectedPlatformsGrid
            connectedPlatforms={connectedPlatforms}
            onConnectionChange={refetchPlatforms}
            isUninitializedBrand={true}
            uninitializedBrandId={uninitializedBrandId!}
          />

          {errorError && (
            <ErrorMessageWrapper>
              <ErrorIcon>⚠️</ErrorIcon>
              <span>{errorError}</span>
            </ErrorMessageWrapper>
          )}

          {submitSuccess && (
            <SuccessMessage>
              <span>✅</span>
              <span>Brand created successfully! Redirecting...</span>
            </SuccessMessage>
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
              {isSubmitting ? 'Creating...' : submitSuccess ? 'Success!' : 'Create Brand'}
            </SubmitBtn>
          </Actions>
        </Form>
      </Content>
    </Container>
  );
};

export default BrandSetupForm;
