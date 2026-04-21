import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrandSetupForm from '@components/Brand/BrandSetupForm/BrandSetupForm';

const CreateBrandPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <BrandSetupForm
      variant="first"
      showBackground
      onBack={() => navigate('/tell-us-who-you-are')}
      onSuccess={() => navigate('/', { replace: true })}
    />
  );
};

export default CreateBrandPage;
