import React from 'react';
import { useParams } from 'react-router-dom';
import { useBrands } from '@hooks/useBrands';
import GlobalNav from '@components/Navigation/GlobalNav';
import ProducerPage from './ProducerPage';
import CreatorsPage from './CreatorsPage';
import WizardPage from './WizardPage';
import { styles } from './styles';

const StudioPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const { brands, currentBrand, switchBrand } = useBrands();

  const renderContent = () => {
    switch (section) {
      case 'creators':
        return <CreatorsPage />;
      case 'wizard':
        return <WizardPage />;
      case 'producer':
        return <ProducerPage />;
      default:
        return (
          <div style={styles.defaultContent}>
            <div style={styles.contentHeader}>
              <h1 style={styles.contentTitle}>Studio</h1>
              <p style={styles.contentSubtitle}>
                Create amazing content with our powerful studio tools. From AI-powered creators to intuitive wizards and professional producer mode.
              </p>
            </div>
            <div style={styles.studioFeatures}>
              <div style={styles.featureCard} onClick={() => window.location.href = '/studio/creators'}>
                <span style={styles.featureIcon}>👥</span>
                <h3 style={styles.featureTitle}>Creators</h3>
                <p style={styles.featureDescription}>
                  AI-powered content creators that understand your brand voice and generate engaging posts automatically.
                </p>
              </div>
              <div style={styles.featureCard} onClick={() => window.location.href = '/studio/wizard'}>
                <span style={styles.featureIcon}>🪄</span>
                <h3 style={styles.featureTitle}>Wizard</h3>
                <p style={styles.featureDescription}>
                  Step-by-step guided content creation with smart templates and personalized recommendations.
                </p>
              </div>
              <div style={{ ...styles.featureCard, ...styles.featureCardPremium }} onClick={() => window.location.href = '/studio/producer'}>
                <span style={styles.featureIcon}>🎯</span>
                <h3 style={styles.featureTitle}>Producer Mode</h3>
                <p style={styles.featureDescription}>
                  Advanced tools for professional content creators with full control over every detail.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />
      {renderContent()}
    </div>
  );
};

export default StudioPage;