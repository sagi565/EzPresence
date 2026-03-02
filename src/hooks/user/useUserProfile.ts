import { useUserContext } from '@context/UserContext';

export const useUserProfile = () => {
  return useUserContext();
};
