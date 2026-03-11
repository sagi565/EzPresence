import React from 'react';
import { theme } from '@theme/theme';
import type { ConnectedPlatform } from '@/models/Platform';
import { getPlatformDisplayName } from '@/models/Platform';
import {
  PlatformTabsContainer,
  PlatformEmptyState,
  PlatformButton,
  CheckboxIndicator,
  PlatformIcon,
  PlatformTextWrapper,
  PlatformName,
  PlatformUsername,
  ProfilePicture
} from './styles';

interface PlatformTabsProps {
  connectedPlatforms: ConnectedPlatform[];
  selected: string[];  // multi-select
  onChange: (platforms: string[]) => void;
}

const platformColor: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  tiktok: '#010101',
  youtube: '#FF0000',
};

const PlatformTabs: React.FC<PlatformTabsProps> = ({
  connectedPlatforms,
  selected,
  onChange,
}) => {
  const activePlatforms = connectedPlatforms.filter(p => p.isConnected);

  if (!activePlatforms.length) {
    return (
      <PlatformEmptyState>
        No platforms connected. Visit <strong>Home</strong> to connect your social accounts.
      </PlatformEmptyState>
    );
  }

  const toggle = (platformId: string) => {
    if (selected.includes(platformId)) {
      // Don't allow deselecting the last one
      if (selected.length === 1) return;
      onChange(selected.filter(p => p !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  return (
    <PlatformTabsContainer>
      {activePlatforms.map(platform => {
        const isActive = selected.includes(platform.platform);
        const color = platformColor[platform.platform] || theme.colors.primary;

        return (
          <PlatformButton
            key={platform.platform}
            onClick={() => toggle(platform.platform)}
            title={isActive && selected.length === 1 ? 'At least one platform must be selected' : undefined}
            $active={isActive}
            $color={color}
          >
            {/* Checkbox indicator */}
            <CheckboxIndicator $active={isActive} $color={color}>
              {isActive && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </CheckboxIndicator>

            {/* Platform icon */}
            <PlatformIcon
              src={`/icons/social/${platform.platform}.png`}
              alt={platform.platform}
            />

            {/* Name + username */}
            <PlatformTextWrapper>
              <PlatformName $active={isActive} $color={color}>
                {getPlatformDisplayName(platform.platform)}
              </PlatformName>
              {platform.username && (
                <PlatformUsername>
                  {platform.username}
                </PlatformUsername>
              )}
            </PlatformTextWrapper>

            {/* Profile picture */}
            {platform.profilePicture && (
              <ProfilePicture
                src={platform.profilePicture}
                alt={platform.username}
                $active={isActive}
                $color={color}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </PlatformButton>
        );
      })}

    </PlatformTabsContainer>
  );
};

export default PlatformTabs;

