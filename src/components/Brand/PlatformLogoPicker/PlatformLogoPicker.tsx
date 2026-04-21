import React from 'react';
import { Check } from 'lucide-react';
import { ConnectedPlatform } from '@/models/Platform';
import { SocialPlatform } from '@models/SocialAccount';
import {
  PickerColumn,
  ChipButton,
  ChipAvatar,
  SelectedBadge,
  SpinnerOverlay,
  Spinner,
} from './styles';

interface PlatformLogoPickerProps {
  connectedPlatforms: ConnectedPlatform[];
  selectedPlatform: SocialPlatform | null;
  onSelect: (cp: ConnectedPlatform) => void;
  convertingPlatform?: SocialPlatform | null;
}

const PlatformLogoPicker: React.FC<PlatformLogoPickerProps> = ({
  connectedPlatforms,
  selectedPlatform,
  onSelect,
  convertingPlatform = null,
}) => {
  const eligible = connectedPlatforms.filter(
    p => p.isConnected && !!p.profilePicture
  );

  if (eligible.length === 0) return null;

  return (
    <PickerColumn>
      {eligible.map((cp) => {
        const isSelected = selectedPlatform === cp.platform;
        const isConverting = convertingPlatform === cp.platform;
        return (
          <ChipButton
            key={cp.platform}
            type="button"
            $isSelected={isSelected}
            $isConverting={isConverting}
            disabled={isConverting}
            onClick={() => onSelect(cp)}
            title={`Use @${cp.username || cp.platform} as logo`}
          >
            <ChipAvatar src={cp.profilePicture!} alt={cp.username || cp.platform} />
            {isConverting ? (
              <SpinnerOverlay>
                <Spinner />
              </SpinnerOverlay>
            ) : isSelected ? (
              <SelectedBadge>
                <Check size={7} strokeWidth={3.5} />
              </SelectedBadge>
            ) : null}
          </ChipButton>
        );
      })}
    </PickerColumn>
  );
};

export default PlatformLogoPicker;
