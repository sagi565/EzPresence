import React from 'react';
import { styles } from './styles';

const CreatorsPage: React.FC = () => {
  return (
    <div style={styles.defaultContent}>
      <div style={styles.contentHeader}>
        <h1 style={styles.contentTitle}>Creators</h1>
        <p style={styles.contentSubtitle}>
          AI-powered content creators - Coming Soon
        </p>
      </div>
    </div>
  );
};

export default CreatorsPage;