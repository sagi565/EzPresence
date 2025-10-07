
import React from 'react';
import { styles } from './styles';

const WizardPage: React.FC = () => {
  return (
    <div style={styles.defaultContent}>
      <div style={styles.contentHeader}>
        <h1 style={styles.contentTitle}>Wizard</h1>
        <p style={styles.contentSubtitle}>
          Step-by-step content creation wizard - Coming Soon
        </p>
      </div>
    </div>
  );
};

export default WizardPage;