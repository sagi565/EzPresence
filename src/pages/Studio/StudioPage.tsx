import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBrands } from '@hooks/useBrands';
import GlobalNav from '@components/Navigation/GlobalNav';
import ProducerMode from '@components/ProducerMode/ProducerMode';
import { styles } from './styles';

type StudioSection = 'home' | 'creators' | 'wizard' | 'producer';

const StudioPage: React.FC = () => {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const { brands, currentBrand, switchBrand } = useBrands();

  const activeSection: StudioSection = (section as StudioSection) || 'home';

  useEffect(() => {
    // Redirect to home if no section specified
    if (!section) {
      navigate('/studio', { replace: true });
    }
  }, [section, navigate]);

  const handleSectionClick = (newSection: StudioSection) => {
    if (newSection === 'home') {
      navigate('/studio');
    } else {
      navigate(`/studio/${newSection}`);
    }
  };

  return (
    <div style={styles.container}>
      <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />
      
      {activeSection === 'home' && (
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.title}>Studio</h1>
            <p style={styles.subtitle}>
              Create amazing content with our powerful studio tools. From AI-powered creators to intuitive wizards and professional producer mode.
            </p>
          </div>
          <div style={styles.featuresGrid}>
            <FeatureCard
              icon="👥"
              title="Creators"
              description="AI-powered content creators that understand your brand voice and generate engaging posts automatically."
              onClick={() => handleSectionClick('creators')}
            />
            <FeatureCard
              icon="🪄"
              title="Wizard"
              description="Step-by-step guided content creation with smart templates and personalized recommendations."
              onClick={() => handleSectionClick('wizard')}
            />
            <FeatureCard
              icon="🎯"
              title="Producer Mode"
              description="Advanced tools for professional content creators with full control over every detail."
              onClick={() => handleSectionClick('producer')}
              isPremium
            />
          </div>
        </div>
      )}

      {activeSection === 'producer' && <ProducerMode />}
      
      {activeSection === 'creators' && (
        <PlaceholderSection
          title="Creators"
          description="AI-powered content creators coming soon..."
          onBack={() => handleSectionClick('home')}
        />
      )}
      
      {activeSection === 'wizard' && (
        <PlaceholderSection
          title="Wizard"
          description="Step-by-step content wizard coming soon..."
          onBack={() => handleSectionClick('home')}
        />
      )}
    </div>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  isPremium?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onClick, isPremium }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.featureCard,
        ...(isPremium ? styles.featureCardPremium : {}),
        ...(isHovered ? styles.featureCardHover : {}),
        ...(isHovered && isPremium ? styles.featureCardPremiumHover : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={styles.featureIcon}>{icon}</span>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDescription}>{description}</p>
    </div>
  );
};

interface PlaceholderSectionProps {
  title: string;
  description: string;
  onBack: () => void;
}

const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({ title, description, onBack }) => {
  return (
    <div style={styles.placeholderContent}>
      <h2 style={styles.placeholderTitle}>{title}</h2>
      <p style={styles.placeholderText}>{description}</p>
      <button style={styles.backButton} onClick={onBack}>
        ← Back to Studio
      </button>
    </div>
  );
};

export default StudioPage;