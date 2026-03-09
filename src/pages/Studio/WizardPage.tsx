
import React from 'react';
import { DefaultContent, ContentHeader, ContentTitle, ContentSubtitle } from './styles';

const WizardPage: React.FC = () => {
  return (
    <DefaultContent>
      <ContentHeader>
        <ContentTitle>Wizard</ContentTitle>
        <ContentSubtitle>
          Step-by-step content creation wizard - Coming Soon
        </ContentSubtitle>
      </ContentHeader>
    </DefaultContent>
  );
};

export default WizardPage;