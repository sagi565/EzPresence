import React, { useState } from 'react';
import { SocialPlatform, PLATFORM_COLORS, PLATFORM_NAMES } from '@models/SocialAccount';
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
}

export const CompactSocialButton: React.FC<CompactSocialButtonProps> = ({
  platform,
  brandId,
}) => {
  const { isConnected, account, loading, connect, disconnect } = useConnectPlatform(platform, brandId);
  const [isHovered, setIsHovered] = useState(false);

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
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: platformColors.gradient,
      transition: 'all 0.3s',
      flexShrink: 0,
      transform: isHovered && !loading ? 'rotate(5deg) scale(1.1)' : 'rotate(0) scale(1)',
      position: 'relative' as const,
      zIndex: 1,
    },
    icon: {
      width: '20px',
      height: '20px',
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
    connectedBadge: {
      fontSize: '11px',
      fontWeight: 600,
      color: 'white',
      background: 'rgba(255, 255, 255, 0.25)',
      padding: '4px 8px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      position: 'relative' as const,
      zIndex: 1,
      backdropFilter: 'blur(8px)',
      lineHeight: '1',
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
      {loading ? (
        <div style={styles.spinner} />
      ) : (
        <>
          <span style={styles.text}>
            {isConnected && account?.accountName ? account.accountName : `Connect to ${platformName}`}
          </span>
          {isConnected && (
            <div style={styles.connectedBadge}>
              {/* Show disconnect hint on hover */}
              {isHovered ? '✕ Disconnect' : '● Connected'}
            </div>
          )}
        </>
      )}
    </button>
  );
};