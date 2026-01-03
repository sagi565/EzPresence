import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostUser, CreateUserData } from '@/hooks/user/usePostUser';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { Gender, validateBirthDate } from '@models/User';
import SocialsBackground from '@components/Background/SocialsBackground';
import { DatePicker, CountrySelector, GenderSelector, FormInput } from '@components/CreateUser';
import { styles } from './styles';

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
`;
if (!document.head.querySelector('style[data-create-user-animations]')) {
  styleSheet.setAttribute('data-create-user-animations', 'true');
  document.head.appendChild(styleSheet);
}

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { createUser, loading, error } = usePostUser(); 
  const { refetchProfile, hasProfile } = useUserProfile();
  
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
  }>({});
    
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // FIXED: Check if user already has a profile and redirect them
  useEffect(() => {
    console.log('🔍 [CreateUserPage] Checking if user already has profile...');
    
    // Small delay to ensure profile has loaded
    const checkProfile = async () => {
      // Wait a bit for profile to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (hasProfile()) {
        console.log('⚠️ [CreateUserPage] User already has profile, redirecting to brand creation');
        navigate('/create-your-first-brand', { replace: true });
      }
    };
    
    checkProfile();
  }, [hasProfile, navigate]);
  
  const handleButtonClick = () => {
    if (!isSubmitting && !loading) {
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('📤 [CreateUserPage] Creating user profile...');
      await createUser(formData);
      console.log('✅ [CreateUserPage] Profile created successfully');
      
      setSubmitSuccess(true);
      
      // Refetch profile to update the context
      console.log('🔄 [CreateUserPage] Refetching profile...');
      await refetchProfile();
      
      setTimeout(() => {
        console.log('🔀 [CreateUserPage] Redirecting to brand creation...');
        navigate('/create-your-first-brand', { replace: true });
      }, 500);
      
    } catch (err: any) {
      console.error('❌ [CreateUserPage] Failed to create profile:', err);
      
      // FIXED: If the error is "user already exists", redirect to brand creation
      if (err.message && err.message.toLowerCase().includes('already exists')) {
        console.log('⚠️ [CreateUserPage] User already exists, redirecting to brand creation');
        setSubmitSuccess(true);
        
        // Refetch to ensure we have the latest data
        await refetchProfile();
        
        setTimeout(() => {
          navigate('/create-your-first-brand', { replace: true });
        }, 500);
      } else {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: string | Gender | undefined) => {
    setFormData({ ...formData, [field]: value || undefined });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div style={styles.container}>
      <SocialsBackground />
      <div style={styles.content}>
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
            />
          </div>

          {/* Error Message */}
          {error && !error.toLowerCase().includes('already exists') && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <div style={styles.successMessage}>
              <span style={styles.successIcon}>✅</span>
              <span>Profile created successfully! Redirecting...</span>
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
                  Creating...
                </>
              ) : submitSuccess ? (
                <>
                  <span>✅</span>
                  Success!
                </>
              ) : (
                'Create Profile'
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