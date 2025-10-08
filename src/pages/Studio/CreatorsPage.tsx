import React from 'react';
import CreatorsShowcase from '@components/Studio/Creators/CreatorsShowcase/CreatorsShowcase';
import { styles } from './styles';

const CreatorsPage: React.FC = () => {
  return (
    <div style={styles.creatorsContainer}>
      <CreatorsShowcase />
    </div>
  );
};

export default CreatorsPage;