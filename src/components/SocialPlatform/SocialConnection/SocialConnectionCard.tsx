import React, { useState } from 'react';
import { SocialPlatform, PLATFORM_COLORS, PLATFORM_NAMES } from '@models/SocialAccount';
import { useConnectPlatform } from '@/hooks/platforms/useConnectPlatform';
import ConfirmDialog from '@/components/Scheduler/CreateModals/ConfirmDialog/ConfirmDialog';
import { socialCardStyles as styles } from './styles';

interface SocialConnectionCardProps {
  platform: SocialPlatform;
  brandId: string;
}

export const SocialConnectionCard: React.FC<SocialConnectionCardProps> = ({
  platform,
  brandId,
}) => {
  const { isConnected, account, loading, connect, disconnect } = useConnectPlatform(platform, brandId);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const platformColors = PLATFORM_COLORS[platform];
  const platformName = PLATFORM_NAMES[platform];

  const handleAction = async () => {
    if (loading) return;

    if (isConnected) {
      setShowDisconnectConfirm(true);
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      await connect();
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
    }
  };

  const confirmDisconnect = async () => {
    setShowDisconnectConfirm(false);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      await disconnect();
    } catch (error) {
      console.error(`Failed to disconnect ${platform}:`, error);
    }
  };

  const getIconPath = () => {
    return `/icons/social/${platform}.png`;
  };

  const getIconEmoji = () => {
    const emojis: Record<SocialPlatform, string> = {
      facebook: '📘',
      instagram: '📷',
      tiktok: '🎵',
      youtube: '▶️',
    };
    return emojis[platform];
  };

  const [iconError, setIconError] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered && !loading ? (isConnected ? styles.cardHoveredConnected : styles.cardHoveredDisconnected) : {}),
        ...(isAnimating ? styles.cardAnimating : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient Overlay */}
      <div
        style={{
          ...styles.gradientOverlay,
          background: isConnected ? platformColors.gradient : 'transparent',
          opacity: isConnected ? 0.015 : 0,
        }}
      />

      {/* Top Section: Icon and Platform Name */}
      <div style={styles.topSection}>
        {/* Icon Container */}
        <div
          style={{
            ...styles.iconContainer,
            background: platformColors.gradient,
            ...(isHovered && !loading ? styles.iconContainerHovered : {}),
          }}
        >
          {!iconError ? (
            <img
              src={getIconPath()}
              alt={platformName}
              style={styles.icon}
              onError={() => setIconError(true)}
            />
          ) : (
            <span style={styles.iconEmoji}>{getIconEmoji()}</span>
          )}
        </div>

        {/* Platform Name and Status */}
        <div style={styles.nameSection}>
          <h3 style={styles.platformName}>{platformName}</h3>
          {isConnected && (
            <span style={styles.connectedBadge}>● Connected</span>
          )}
        </div>
      </div>

      {/* Account Name */}
      {isConnected && account?.accountName ? (
        <p style={styles.accountName}>{account.accountName}</p>
      ) : (
        <p style={styles.notConnectedText}>Not connected</p>
      )}

      {/* Action Button */}
      <button
        style={{
          ...styles.actionButton,
          ...(isConnected ? styles.disconnectButton : styles.connectButton),
          background: isConnected ? 'transparent' : platformColors.gradient,
          ...(isHovered && !loading ? (isConnected ? styles.disconnectButtonHovered : styles.connectButtonHovered) : {}),
        }}
        onClick={handleAction}
        disabled={loading}
      >
        {loading ? (
          <span style={styles.spinner} />
        ) : isConnected ? (
          isHovered ? 'Disconnect' : 'Connected'
        ) : (
          'Connect'
        )}
      </button>

      {/* Animated Border Effect for Connected State */}
      {isConnected && (
        <div
          style={{
            ...styles.animatedBorder,
            background: platformColors.gradient,
          }}
        />
      )}

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
    </div>
  );
};