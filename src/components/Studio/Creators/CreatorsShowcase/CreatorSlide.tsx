import React, { forwardRef, useState } from 'react';
import { styles } from './styles';

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
  onTry: (id: string) => void;
  onLearnMore: (id: string) => void;
}

const CreatorSlide = forwardRef<HTMLElement, CreatorSlideProps>(
  ({ creator, isActive, onTry, onLearnMore }, ref) => {
    const [hoveredBtn, setHoveredBtn] = useState<'try' | 'learn' | null>(null);

    const slideStyle = {
      ...styles.creatorSlide,
      ...(creator.id === 'show-time' && styles.slideShowTime),
      ...(creator.id === 'matrix' && styles.slideMatrix),
      ...(creator.id === 'notes' && styles.slideNotes),
      ...(creator.id === 'picasso' && styles.slidePicasso),
    };

    const previewStyle = {
      ...styles.previewDisplay,
      ...(creator.previewClass === 'show-time' && styles.previewShowTime),
      ...(creator.previewClass === 'matrix' && styles.previewMatrix),
      ...(creator.previewClass === 'notes' && styles.previewNotes),
      ...(creator.previewClass === 'picasso' && styles.previewPicasso),
      ...(isActive ? styles.previewDisplayActive : {}),
    };

    const tryBtnStyle = {
      ...styles.btnPrimary,
      ...(hoveredBtn === 'try' ? styles.btnPrimaryHover : {}),
    };

    const learnBtnStyle = {
      ...styles.btnSecondary,
      ...(hoveredBtn === 'learn' ? styles.btnSecondaryHover : {}),
    };

    return (
      <section ref={ref} style={slideStyle}>
        <div style={styles.creatorContent}>
          <div style={styles.previewContainer}>
            <div style={previewStyle}>
              <div style={styles.previewLabel}>
                <span style={styles.previewDot} />
                Preview
              </div>
            </div>
          </div>

          <div style={styles.creatorDetails}>
            <div style={styles.creatorSubtitle}>{creator.subtitle}</div>
            <h1 style={styles.creatorTitle}>{creator.name}</h1>
            <p style={styles.creatorDescription}>{creator.description}</p>

            <div style={styles.creatorMeta}>
              <span
                style={{
                  ...styles.pill,
                  ...(creator.mediaType === 'Video'
                    ? styles.pillTypeVideo
                    : styles.pillTypeImage),
                }}
              >
                <span>{creator.mediaType === 'Video' ? '🎥' : '🖼️'}</span>
                <span>{creator.mediaType}</span>
              </span>
              <span style={{ ...styles.pill, ...styles.pillCredits }}>
                <span>💎</span>
                <span>{creator.credits} Credits</span>
              </span>
            </div>

            <div style={styles.creatorActions}>
              <button
                style={tryBtnStyle}
                onClick={() => onTry(creator.id)}
                onMouseEnter={() => setHoveredBtn('try')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                Try Now!
              </button>
              <button
                style={learnBtnStyle}
                onClick={() => onLearnMore(creator.id)}
                onMouseEnter={() => setHoveredBtn('learn')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

CreatorSlide.displayName = 'CreatorSlide';

export default CreatorSlide;