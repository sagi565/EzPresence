import React from 'react';
import { theme } from '@theme/theme';
import type { ConnectedPlatform } from '@/models/Platform';
import { getPlatformDisplayName } from '@/models/Platform';

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
      <div style={{
        padding: '14px 20px',
        background: 'white',
        borderRadius: theme.borderRadius.md,
        color: theme.colors.muted,
        fontSize: '14px',
      }}>
        No platforms connected. Visit <strong>Home</strong> to connect your social accounts.
      </div>
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
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
      {activePlatforms.map(platform => {
        const isActive = selected.includes(platform.platform);
        const color = platformColor[platform.platform] || theme.colors.primary;

        return (
          <button
            key={platform.platform}
            onClick={() => toggle(platform.platform)}
            title={isActive && selected.length === 1 ? 'At least one platform must be selected' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 14px',
              borderRadius: theme.borderRadius.md,
              border: isActive
                ? `2px solid ${color}`
                : '2px solid #e5e7eb',
              background: isActive ? `${color}12` : 'white',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: isActive ? `0 2px 12px ${color}28` : '0 1px 4px rgba(0,0,0,0.06)',
              opacity: !isActive ? 0.75 : 1,
            }}
          >
            {/* Checkbox indicator */}
            <div style={{
              width: 16, height: 16, borderRadius: 4,
              border: `2px solid ${isActive ? color : '#d1d5db'}`,
              background: isActive ? color : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.15s',
            }}>
              {isActive && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            {/* Platform icon */}
            <img
              src={`/icons/social/${platform.platform}.png`}
              alt={platform.platform}
              style={{ width: 20, height: 20, objectFit: 'contain', borderRadius: 3 }}
            />

            {/* Name + username */}
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '13px', fontWeight: 700,
                color: isActive ? color : theme.colors.text,
                lineHeight: 1.2,
              }}>
                {getPlatformDisplayName(platform.platform)}
              </div>
              {platform.username && (
                <div style={{ fontSize: '11px', color: theme.colors.muted }}>
                  {platform.username}
                </div>
              )}
            </div>

            {/* Profile picture */}
            {platform.profilePicture && (
              <img
                src={platform.profilePicture}
                alt={platform.username}
                style={{
                  width: 26, height: 26, borderRadius: '50%',
                  objectFit: 'cover',
                  border: `2px solid ${isActive ? color : '#e5e7eb'}`,
                  marginLeft: 2, flexShrink: 0,
                }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </button>
        );
      })}

    </div>
  );
};

export default PlatformTabs;
