import React, { forwardRef } from 'react';
import { 
  SlideSection, 
  SlideContent, 
  PreviewContainer, 
  PreviewDisplay, 
  PreviewLabel, 
  PreviewDot,
  CreatorDetails,
  CreatorSubtitle,
  CreatorTitle,
  CreatorDescription,
  CreatorMeta,
  Pill,
  CreatorActions,
  Button
} from './styles';

interface CreatorSlideProps {
  creator: {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    mediaType: string;
    credits: number;
    previewClass: string;
    icon: string;
  };
  isActive: boolean;
  isMobile: boolean;
  onTry: (id: string) => void;
  onLearnMore: (id: string) => void;
}

const CreatorSlide = forwardRef<HTMLElement, CreatorSlideProps>(
  ({ creator, isActive, isMobile, onTry, onLearnMore }, ref) => {
    return (
      <SlideSection ref={ref} $isMobile={isMobile}>
        <SlideContent $isMobile={isMobile}>
          <PreviewContainer>
            <PreviewDisplay 
              $isActive={isActive} 
              $type={creator.id} 
              $isMobile={isMobile}
            >
              <PreviewLabel>
                <PreviewDot />
                Preview
              </PreviewLabel>
            </PreviewDisplay>
          </PreviewContainer>

          <CreatorDetails $isMobile={isMobile}>
            <CreatorSubtitle>{creator.subtitle}</CreatorSubtitle>
            <CreatorTitle $isMobile={isMobile}>{creator.name}</CreatorTitle>
            <CreatorDescription $isMobile={isMobile}>
              {creator.description}
            </CreatorDescription>

            <CreatorMeta>
              <Pill $type={creator.mediaType === 'Video' ? 'video' : 'image'}>
                <span>{creator.mediaType === 'Video' ? '🎥' : '🖼️'}</span>
                <span>{creator.mediaType}</span>
              </Pill>
              <Pill $type="credits">
                <span>💎</span>
                <span>{creator.credits} Credits</span>
              </Pill>
            </CreatorMeta>

            <CreatorActions>
              <Button $primary onClick={() => onTry(creator.id)}>
                Try Now!
              </Button>
              <Button onClick={() => onLearnMore(creator.id)}>
                Learn More
              </Button>
            </CreatorActions>
          </CreatorDetails>
        </SlideContent>
      </SlideSection>
    );
  }
);

CreatorSlide.displayName = 'CreatorSlide';

export default CreatorSlide;