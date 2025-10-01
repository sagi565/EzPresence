import React, { useState } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType } from '@models/VideoModel';
import DetailedView from './DetailedView';
import { styles } from './styles';

interface IdeaCardProps {
  idea: VideoIdea;
  selectedModel: VideoModelType;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, selectedModel }) => {
  const [isDetailed, setIsDetailed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handleCardClick = () => {
    if (!isDetailed) {
      setIsFocused(true);
    }
  };

  const handlePreviewClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPreviewLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 5000));

    setIsPreviewLoading(false);
    setIsFocused(false);
    setIsDetailed(true);
  };

  const handleClose = () => {
    setIsDetailed(false);
    setIsFocused(false);
  };

  if (isDetailed) {
    return (
      <DetailedView
        idea={idea}
        selectedModel={selectedModel}
        onClose={handleClose}
      />
    );
  }

  return (
    <>
      {(isFocused || isDetailed) && (
        <div
          style={styles.focusOverlay}
          onClick={handleClose}
        />
      )}
      <div
        style={{
          ...styles.ideaCard,
          ...(isFocused ? styles.ideaCardFocused : {}),
        }}
        onClick={handleCardClick}
      >
        {isFocused ? (
          <>
            <textarea
              style={styles.ideaTextarea}
              defaultValue={idea.idea}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              style={styles.previewBtn}
              onClick={handlePreviewClick}
              disabled={isPreviewLoading}
              data-tooltip="See video plan, duration and cost before creating"
            >
              {isPreviewLoading ? (
                <>
                  Preview Details
                  <span style={styles.loadingSpinner}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </>
              ) : (
                'Preview Details'
              )}
            </button>
          </>
        ) : (
          <span style={styles.ideaText}>{idea.idea}</span>
        )}
      </div>
    </>
  );
};

export default IdeaCard;