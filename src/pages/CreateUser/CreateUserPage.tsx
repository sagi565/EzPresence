import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostUser, CreateUserData } from '@/hooks/user/usePostUser';
import { useUpdateUser } from '@/hooks/user/usePutUser';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { api } from '@utils/apiClient';
import { Gender, validateBirthDate } from '@models/User';
import SocialsBackground from '@components/Background/SocialsBackground';
import { DatePicker, CountrySelector, GenderSelector, FormInput } from '@components/CreateUser';
import { styles } from './styles';
import { LogOut } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/auth/useFirebaseAuth';

// Add CSS animations and dropdown styling
const styleSheet = document.createElement('style');
styleSheet.textContent = `
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
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Better select dropdown styling */
  .create-user-form select {
    transition: border-color 0.2s ease;
  }
  
  .create-user-form select:hover {
    border-color: rgba(155, 93, 229, 0.35);
  }
  
  .create-user-form select:focus {
    border-color: rgba(155, 93, 229, 0.4);
    outline: none;
  }
  
  .create-user-form select option {
    padding: 12px 16px;
    background: white;
    color: #111827;
  }
  
  .create-user-form select option:checked {
    background: rgba(155, 93, 229, 0.1);
    color: #9b5de5;
  }

  /* Country dropdown scrollbar */
  .create-user-form [style*="overflow"] {
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 93, 229, 0.3) transparent;
  }
  
  .create-user-form [style*="overflow"]::-webkit-scrollbar {
    width: 6px;
  }
  
  .create-user-form [style*="overflow"]::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .create-user-form [style*="overflow"]::-webkit-scrollbar-thumb {
    background: rgba(155, 93, 229, 0.3);
    border-radius: 3px;
  }
  
  .create-user-form [style*="overflow"]::-webkit-scrollbar-thumb:hover {
    background: rgba(155, 93, 229, 0.5);
  }

  /* Logout Button */
  .logout-btn {
    position: absolute;
    top: 24px;
    right: 24px;
    background: transparent;
    border: none;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ef4444;
    cursor: pointer;
    z-index: 50;
    border-radius: 50%;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;
if (!document.head.querySelector('style[data-create-user-animations]')) {
  styleSheet.setAttribute('data-create-user-animations', 'true');
  document.head.appendChild(styleSheet);
}

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
    <div style={styles.container}>
      <SocialsBackground />

      <div style={styles.content}>
        {/* Logout Button */}
        <button
          className="logout-btn"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Logout"
        >
          {isLoggingOut ? (
            <span style={{ ...styles.spinner, borderColor: 'rgba(239, 68, 68, 0.3)', borderTopColor: '#ef4444' }} />
          ) : (
            <LogOut className="door-icon" size={24} color="#ef4444" strokeWidth={2.5} />
          )}
        </button>
        <div style={styles.header}>
          <h1 style={styles.title}>Tell Us Who You Are</h1>
          <p style={styles.subtitle}>Help us set up your profile in just a few steps</p>
        </div>

        <form style={styles.form} className="create-user-form" onSubmit={handleSubmit}>
          {/* Name Row */}
          {(() => {
            interface NameInputChange {
              (value: string): void;
            }

            const onFirstNameChange: NameInputChange = (value) => handleInputChange('firstName', value);
            const onLastNameChange: NameInputChange = (value) => handleInputChange('lastName', value);

            return (
              <div style={styles.row}>
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
              </div>
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
          <div style={styles.row}>
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
          </div>

          {/* Error Message */}
          {error && !error.toLowerCase().includes('already exists') && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div style={styles.actions}>
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(isSubmitting ? styles.submitBtnLoading : {}),
                ...(isButtonHovered && !isSubmitting ? styles.submitBtnHover : {}),
                ...(isButtonActive && !isSubmitting ? styles.submitBtnActive : {}),
              }}
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
              {showRipple && <span style={styles.ripple} />}
              {isSubmitting ? (
                <>
                  <span style={styles.spinner} />
                  {profile ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                profile ? 'Update Profile' : 'Create Profile'
              )}
            </button>
          </div>

          {/* Privacy Note */}
          <p style={styles.privacyNote}>
            🔒 Your information is secure and will only be used to personalize your experience
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;