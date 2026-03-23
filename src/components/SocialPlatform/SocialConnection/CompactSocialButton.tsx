import React, { useState } from 'react';
import { SocialPlatform, PLATFORM_COLORS, PLATFORM_NAMES } from '@models/SocialAccount';
import { ConnectedPlatform } from '@/models/Platform';
import { useConnectPlatform } from '@/hooks/platforms/useConnectPlatform';
import { useAppTheme } from '@/theme/ThemeContext';
import ConfirmDialog from '@/components/Scheduler/CreateModals/ConfirmDialog/ConfirmDialog';
import { 
  CompactButton, 
  CompactIconContainer, 
  CompactIcon, 
  CompactPlatformOverlay, 
  CompactPlatformOverlayIcon, 
  IconEmoji, 
  CompactText, 
  CompactDisconnectBadge, 
  CompactConnectedDot, 
  Spinner 
} from './styles';

interface CompactSocialButtonProps {
  platform: SocialPlatform;
  brandId: string;
  isUninitialized?: boolean;
  connectedPlatform?: ConnectedPlatform;
  onConnectionChange?: () => void;
}

export const CompactSocialButton: React.FC<CompactSocialButtonProps> = ({
  platform,
  brandId,
  isUninitialized = false,
  connectedPlatform,
  onConnectionChange,
}) => {
  const { isConnected: _hookIsConnected, account: _hookAccount, loading, connect, disconnect } = useConnectPlatform(platform, brandId, isUninitialized);
  const [isHovered, setIsHovered] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  // Rely strictly on connectedPlatform prop for truth
  const isConnected = connectedPlatform?.isConnected ?? false;

  // Display info only from connectedPlatform (which comes from API list)
  const displayUsername = connectedPlatform?.username || connectedPlatform?.displayName;
  const displayProfilePic = connectedPlatform?.profilePicture;

  const { isDarkMode } = useAppTheme();
  const platformColors = PLATFORM_COLORS[platform];
  const platformName = PLATFORM_NAMES[platform];
  const platformGradient = (isDarkMode && platformColors.darkGradient) ? platformColors.darkGradient : platformColors.gradient;

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (isConnected) {
      setShowDisconnectConfirm(true);
      return;
    }

    try {
      // Dispatch connecting event — background shows animated particles for this platform
      window.dispatchEvent(new CustomEvent('ezp:platformConnecting', {
        detail: { platform }
      }));

      await connect();

      // Dispatch connected event — background forms the platform logo shape
      window.dispatchEvent(new CustomEvent('ezp:platformConnected', {
        detail: { platform }
      }));

      // Notify parent to refetch
      if (onConnectionChange) {
        onConnectionChange();
      }
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
      // Clean up connecting state on error
      window.dispatchEvent(new CustomEvent('ezp:platformConnectionFinished', {
        detail: { platform }
      }));
    }
  };

  const confirmDisconnect = async () => {
    setShowDisconnectConfirm(false);
    try {
      await disconnect();
      // Notify parent to refetch
      if (onConnectionChange) {
        onConnectionChange();
      }
    } catch (error) {
      console.error(`Failed to disconnect ${platform}:`, error);
    }
  };

  const getIconPath = () => {
    return `/icons/social/${platform}.png`;
  };

  const [iconError, setIconError] = useState(false);

  const getIconEmoji = () => {
    const emojis: Record<SocialPlatform, string> = {
      facebook: '📘',
      instagram: '📷',
      tiktok: '🎵',
      youtube: '▶️',
    };
    return emojis[platform];
  };

  return (
    <>
      <CompactButton
        type="button"
        $isConnected={isConnected}
        $isHovered={isHovered}
        $isLoading={loading}
        $platformPrimary={platformColors.primary}
        $platformGradient={platformGradient}
        onClick={handleAction}
        disabled={loading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CompactIconContainer
          $isConnected={isConnected}
          $isHovered={isHovered}
          $isLoading={loading}
          $platformGradient={platformGradient}
          $hasProfilePic={!!displayProfilePic}
        >
          {displayProfilePic ? (
            <>
              <CompactIcon
                src={displayProfilePic}
                alt={displayUsername || platformName}
                $hasProfilePic
              />
              <CompactPlatformOverlay>
                <CompactPlatformOverlayIcon
                  src={getIconPath()}
                  alt={platformName}
                />
              </CompactPlatformOverlay>
            </>
          ) : !iconError ? (
            <CompactIcon
              src={getIconPath()}
              alt={platformName}
              onError={() => setIconError(true)}
            />
          ) : (
            <IconEmoji>{getIconEmoji()}</IconEmoji>
          )}
        </CompactIconContainer>

        {loading ? (
          <Spinner $isConnected={isConnected} $platformPrimary={platformColors.primary} />
        ) : (
          <>
            <CompactText $isConnected={isConnected}>
              {isConnected
                ? (isHovered ? <CompactDisconnectBadge>Disconnect</CompactDisconnectBadge> : (displayUsername || 'Connected'))
                : `Connect to ${platformName}`}
            </CompactText>
            {isConnected && (
              <CompactConnectedDot title="Connected" />
            )}
          </>
        )}
      </CompactButton>

      <ConfirmDialog
        isOpen={showDisconnectConfirm}
        title="Disconnect Platform"
        message={`Are you sure you want to disconnect ${platformName}?`}
        confirmLabel="Disconnect"
        cancelLabel="Cancel"
        danger={true}
        onConfirm={confirmDisconnect}
        onCancel={() => setShowDisconnectConfirm(false)}
      />
    </>
  );
}