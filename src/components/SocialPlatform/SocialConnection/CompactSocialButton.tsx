import React, { useState } from 'react';
import { SocialPlatform, PLATFORM_COLORS, PLATFORM_NAMES } from '@models/SocialAccount';
import { ConnectedPlatform } from '@/models/Platform';
import { useConnectPlatform } from '@/hooks/platforms/useConnectPlatform';

// Add CSS animation for gradient shift
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    25% {
      background-position: 50% 75%;
    }
    50% {
      background-position: 100% 50%;
    }
    75% {
      background-position: 50% 25%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  @keyframes gradientPulse {
    0%, 100% {
      background-position: 0% 50%;
      opacity: 0.85;
    }
    50% {
      background-position: 100% 50%;
      opacity: 1;
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('style[data-compact-social-animations]')) {
  styleSheet.setAttribute('data-compact-social-animations', 'true');
  document.head.appendChild(styleSheet);
}

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

  // Rely strictly on connectedPlatform prop for truth
  const isConnected = connectedPlatform?.isConnected ?? false;

  // Display info only from connectedPlatform (which comes from API list)
  const displayUsername = connectedPlatform?.username || connectedPlatform?.displayName;
  const displayProfilePic = connectedPlatform?.profilePicture;

  const platformColors = PLATFORM_COLORS[platform];
  const platformName = PLATFORM_NAMES[platform];

  const handleAction = async () => {
    if (loading) return;
    try {
      if (isConnected) {
        await disconnect();
      } else {
        await connect();
      }
      // Notify parent to refetch
      if (onConnectionChange) {
        onConnectionChange();
      }
    } catch (error) {
      console.error(`Failed to ${isConnected ? 'disconnect' : 'connect'} ${platform}:`, error);
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

  const styles = {
    button: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      borderRadius: '12px',
      border: isConnected ? 'none' : '2px solid',
      borderColor: isConnected ? 'transparent' : platformColors.primary,
      background: isConnected ? platformColors.gradient : 'white',
      backgroundSize: isConnected ? '400% 400%' : 'auto',
      animation: isConnected ? 'gradientShift 8s ease infinite' : 'none',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      transform: isHovered && !loading ? 'translateX(4px)' : 'translateX(0)',
      boxShadow: isHovered && !loading ? '0 6px 16px rgba(155, 93, 229, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.05)',
      width: '100%',
    },
    iconContainer: {
      width: isConnected ? '48px' : '36px',
      height: isConnected ? '48px' : '36px',
      borderRadius: '50%', // Make it circular for profile pics
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: displayProfilePic ? 'white' : platformColors.gradient,
      transition: 'all 0.3s',
      flexShrink: 0,
      transform: isHovered && !loading ? 'rotate(5deg) scale(1.05)' : 'rotate(0) scale(1)',
      position: 'relative' as const,
      zIndex: 1,
      // overflow: 'hidden', // Allow badge to overflow
      border: displayProfilePic ? '2px solid white' : 'none',
    },
    icon: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: displayProfilePic ? 'cover' as const : 'contain' as const,
    },
    platformOverlay: {
      position: 'absolute' as const,
      bottom: '-2px',
      right: '-2px',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      background: 'white',
      padding: '2px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    platformOverlayIcon: {
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const,
    },
    iconEmoji: {
      fontSize: '18px',
    },
    text: {
      fontSize: '14px',
      fontWeight: 700,
      color: isConnected ? 'white' : '#666',
      textAlign: 'left' as const,
      flex: 1,
      position: 'relative' as const,
      zIndex: 1,
      textShadow: isConnected ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none',
    },
    connectedDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#4ade80', // Green-400
      boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
      position: 'absolute' as const,
      top: '12px',
      right: '12px',
      zIndex: 2,
    },
    spinner: {
      width: '18px',
      height: '18px',
      border: '3px solid',
      borderColor: isConnected ? 'rgba(255, 255, 255, 0.3)' : `${platformColors.primary}33`,
      borderTopColor: isConnected ? 'white' : platformColors.primary,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      position: 'relative' as const,
      zIndex: 1,
    },
  };

  return (
    <button
      style={styles.button}
      onClick={handleAction}
      disabled={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.iconContainer}>
        {displayProfilePic ? (
          <>
            <img
              src={displayProfilePic}
              alt={displayUsername || platformName}
              style={styles.icon}
            />
            {/* Small platform logo overlay */}
            <div style={styles.platformOverlay}>
              <img
                src={getIconPath()}
                alt={platformName}
                style={styles.platformOverlayIcon}
              />
            </div>
          </>
        ) : !iconError ? (
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

      {loading ? (
        <div style={styles.spinner} />
      ) : (
        <>
          <span style={styles.text}>
            {isConnected && displayUsername ? displayUsername : `Connect to ${platformName}`}
          </span>
          {isConnected && (
            <div style={styles.connectedDot} title="Connected" />
          )}
        </>
      )}
    </button>
  );
};
