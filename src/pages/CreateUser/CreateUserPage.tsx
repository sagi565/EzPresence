import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostUser, CreateUserData } from '@/hooks/user/usePostUser';
import { useUpdateUser } from '@/hooks/user/usePutUser';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { api } from '@utils/apiClient';
import { Gender, validateBirthDate } from '@models/User';
import SocialsBackground from '@components/Background/SocialsBackground';
import { DatePicker, CountrySelector, GenderSelector, FormInput } from '@components/CreateUser';
import { LogOut } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/auth/useFirebaseAuth';
import { Container, Content, Header, Title, Subtitle, Form, Row, ErrorMessage, ErrorIcon, Actions, SubmitBtn, Ripple, Spinner, PrivacyNote, LogoutButton } from './styles';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useFirebaseAuth();
  const { createUser, loading: createLoading, error: createError } = usePostUser();
  const { updateUser, loading: updateLoading, error: updateError } = useUpdateUser();
  const { profile, loading: profileLoading, refetchProfile } = useUserProfile();

  const loading = createLoading || updateLoading || profileLoading;
  const error = createError || updateError;

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [formData, setFormData] = useState<CreateUserData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    country: undefined,
    gender: undefined,
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const [hasInitialized, setHasInitialized] = useState(false);

  // Pre-fill form data if profile already exists
  useEffect(() => {
    if (profile && !hasInitialized) {
      console.log('📦 [CreateUserPage] Profile data loaded, pre-filling form:', profile);
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        birthDate: profile.birthDate || '',
        country: profile.country || undefined,
        gender: profile.gender || undefined,
      });
      setHasInitialized(true);
    }
  }, [profile, hasInitialized]);

  // Log current formData to debug pre-filling
  useEffect(() => {
    console.log('📝 [CreateUserPage] Current formData:', formData);
  }, [formData]);

  const handleButtonClick = () => {
    if (!isSubmitting && !loading) {
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Make API call to delete user before Firebase logout
      console.log('🗑️ [CreateUserPage] Deleting user from database...');
      try {
        await api.delete('/users');
      } catch (deleteErr) {
        console.error('Failed to delete user from database:', deleteErr);
      }

      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
      setIsLoggingOut(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    const birthDateValidation = validateBirthDate(formData.birthDate);
    if (!birthDateValidation.isValid) {
      newErrors.birthDate = birthDateValidation.error;
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('🚀 [CreateUserPage] HandleSubmit triggered. Profile state:', profile ? 'EXISTS' : 'NULL');
      console.log('🚀 [CreateUserPage] FormData to save:', formData);

      if (profile) {
        console.log('📝 [CreateUserPage] Profile exists, calling updateUser...');
        await updateUser(formData);
      } else {
        console.log('📤 [CreateUserPage] Profile null, calling createUser...');
        await createUser(formData);
      }

      console.log('✅ [CreateUserPage] API call completed successfully');

      // Refetch profile to update the context and confirm completion
      console.log('🔄 [CreateUserPage] Refetching profile...');
      await refetchProfile();

      console.log('🔀 [CreateUserPage] Redirecting to brand creation...');
      navigate('/create-your-first-brand', { replace: true });

    } catch (err: any) {
      console.error('❌ [CreateUserPage] Failed to save profile:', err);

      // Fallback: If create failed because "user already exists", try update instead
      if (err.message && err.message.toLowerCase().includes('already exists')) {
        console.log('⚠️ [CreateUserPage] User already exists, trying update instead...');
        try {
          await updateUser(formData);
          await refetchProfile();
          navigate('/create-your-first-brand', { replace: true });
          return;
        } catch (updateErr) {
          console.error('❌ [CreateUserPage] Update fallback failed:', updateErr);
        }
      }

      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: string | Gender | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value || undefined }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Container>
      <SocialsBackground />

      <Content>
        {/* Logout Button */}
        <LogoutButton
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Logout"
        >
          {isLoggingOut ? (
            <Spinner $logout />
          ) : (
            <LogOut className="door-icon" size={24} color="#ef4444" strokeWidth={2.5} />
          )}
        </LogoutButton>
        <Header>
          <Title>Tell Us <br className="mobile-only" /> Who You Are</Title>
          <Subtitle>Help us set up your profile in just a few steps</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Name Row */}
          {(() => {
            interface NameInputChange {
              (value: string): void;
            }

            const onFirstNameChange: NameInputChange = (value) => handleInputChange('firstName', value);
            const onLastNameChange: NameInputChange = (value) => handleInputChange('lastName', value);

            return (
              <Row>
                <FormInput
                  label="First Name"
                  value={formData.firstName}
                  onChange={onFirstNameChange}
                  error={errors.firstName}
                  required
                  maxLength={50}
                  name="given-name"
                  autoComplete="given-name"
                />

                <FormInput
                  label="Last Name"
                  value={formData.lastName}
                  onChange={onLastNameChange}
                  error={errors.lastName}
                  required
                  maxLength={50}
                  name="family-name"
                  autoComplete="family-name"
                />
              </Row>
            );
          })()}

          {/* Birth Date */}
          <DatePicker
            label="Birth Date"
            value={formData.birthDate}
            onChange={(date) => handleInputChange('birthDate', date)}
            error={errors.birthDate}
            required
            minAge={13}
            maxAge={120}
          />

          {/* Country and Gender Row */}
          <Row>
            <CountrySelector
              label="Country"
              value={formData.country || ''}
              onChange={(country) => handleInputChange('country', country)}
            />

            <GenderSelector
              label="Gender"
              value={formData.gender}
              onChange={(gender) => handleInputChange('gender', gender)}
              error={errors.gender}
            />
          </Row>

          {/* Error Message */}
          {error && !error.toLowerCase().includes('already exists') && (
            <ErrorMessage>
              <ErrorIcon>⚠️</ErrorIcon>
              <span>User already exists - {error}</span>
            </ErrorMessage>
          )}

          {/* Action Button */}
          <Actions>
            <SubmitBtn
              type="submit"
              $isSubmitting={isSubmitting}
              $isHovered={isButtonHovered}
              $isActive={isButtonActive}
              disabled={loading || isSubmitting}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => {
                setIsButtonHovered(false);
                setIsButtonActive(false);
              }}
              onMouseDown={() => {
                setIsButtonActive(true);
                handleButtonClick();
              }}
              onMouseUp={() => setIsButtonActive(false)}
            >
              {showRipple && <Ripple />}
              {isSubmitting ? (
                <>
                  <Spinner />
                  {profile ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                profile ? 'Update Profile' : 'Create Profile'
              )}
            </SubmitBtn>
          </Actions>

          {/* Privacy Note */}
          <PrivacyNote>
            🔒 Your information is secure and will only be used to personalize your experience
          </PrivacyNote>
        </Form>
      </Content>
    </Container>
  );
};

export default CreateUserPage;