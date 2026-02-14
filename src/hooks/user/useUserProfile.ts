import { useUserProfileContext } from '@/context/UserProfileProvider';

export const useUserProfile = () => {
  return useUserProfileContext();
};
