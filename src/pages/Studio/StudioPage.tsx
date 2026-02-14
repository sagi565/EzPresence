import React from 'react';
import { useParams } from 'react-router-dom';
import { useBrands } from '@/hooks/brands/useBrands';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import ProducerPage from './ProducerPage';
import CreatorsPage from './CreatorsPage';
import WizardPage from './WizardPage';
import { styles } from './styles';

const StudioPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const { brands, currentBrand, switchBrand } = useBrands();

  const renderContent = () => {
    switch (section) {
      case 'wizard':
        return <WizardPage />;
      case 'producer':
        return <ProducerPage />;
      default:
        // Default to creators page when no section or 'creators' section
        return <CreatorsPage />;
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