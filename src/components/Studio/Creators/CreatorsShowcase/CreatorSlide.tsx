import { forwardRef } from 'react';
import {
  SlideSection,
  SlideContent,
  PreviewContainer,
  PreviewDisplay,
  PreviewDot,
  PreviewVideo,
  TagBadge,
  CreatorDetails,
  CreatorSubtitle,
  CreatorTitle,
  TitleRow,
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
    previewClass: string;
    icon: string;
    videoSrc?: string;
    tag?: string;
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
              {creator.videoSrc && (
                <PreviewVideo
                  src={creator.videoSrc}
                  loop
                  muted
                  playsInline
                  autoPlay
                />
              )}
              <PreviewDot />
              {creator.tag && (
                <TagBadge $id={creator.id} $inVideo>{creator.tag}</TagBadge>
              )}
            </PreviewDisplay>
          </PreviewContainer>

          <CreatorDetails $isMobile={isMobile}>
            <CreatorSubtitle>{creator.subtitle}</CreatorSubtitle>

            <TitleRow $isMobile={isMobile}>
              {isMobile && (
                <Pill $type={creator.mediaType === 'Video' ? 'video' : 'image'} $isInline>
                  <span>{creator.mediaType === 'Video' ? '🎥' : '🖼️'}</span>
                  <span>{creator.mediaType}</span>
                </Pill>
              )}
              <CreatorTitle $isMobile={isMobile}>{creator.name}</CreatorTitle>
            </TitleRow>

            <CreatorDescription $isMobile={isMobile}>
              {creator.description}
            </CreatorDescription>

            {!isMobile && (
              <CreatorMeta>
                <Pill $type={creator.mediaType === 'Video' ? 'video' : 'image'}>
                  <span>{creator.mediaType === 'Video' ? '🎥' : '🖼️'}</span>
                  <span>{creator.mediaType}</span>
                </Pill>
              </CreatorMeta>
            )}

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