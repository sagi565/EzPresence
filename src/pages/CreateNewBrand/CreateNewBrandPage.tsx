import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrandSetupForm from '@components/Brand/BrandSetupForm/BrandSetupForm';

const CreateNewBrandPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <BrandSetupForm
      variant="additional"
      onBack={() => navigate('/')}
      onSuccess={() => {
        navigate('/', { replace: true });
        window.location.reload();
      }}
    />
  );
};

export default CreateNewBrandPage;
