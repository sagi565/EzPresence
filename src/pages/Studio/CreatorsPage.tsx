import React from 'react';
import CreatorsShowcase from '@components/Studio/Creators/CreatorsShowcase/CreatorsShowcase';
import { CreatorsContainer } from './styles';

const CreatorsPage: React.FC = () => {
  return (
    <CreatorsContainer>
      <CreatorsShowcase />
    </CreatorsContainer>
  );
};

export default CreatorsPage;