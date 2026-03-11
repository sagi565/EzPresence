import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { VideoIdea } from '@models/VideoIdea';
import { 
  Overlay, 
  FocusedCard, 
  FocusedTextArea, 
  PreviewBtn, 
  LoadingDotsContainer 
} from './styles';

interface IdeaFocusViewProps {
  idea: VideoIdea;
  onUpdate: (ideaId: string, updates: Partial<VideoIdea>) => void;
  onClose: () => void;
  onPreviewDetails: () => void;
  showPreviewLoading: boolean;
}

const IdeaFocusView: React.FC<IdeaFocusViewProps> = ({
  idea,
  onUpdate,
  onClose,
  onPreviewDetails,
  showPreviewLoading,
}) => {
  const [ideaText, setIdeaText] = useState(idea.idea);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBlur = () => {
    if (ideaText !== idea.idea) {
      onUpdate(idea.id, { idea: ideaText });
    }
  };

  return ReactDOM.createPortal(
    <>
      <Overlay onClick={onClose} />
      <FocusedCard>
        <FocusedTextArea
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showPreviewLoading && (
            <LoadingDotsContainer className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </LoadingDotsContainer>
          )}

          <PreviewBtn
            onClick={onPreviewDetails}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            $isHovered={isButtonHovered}
            disabled={showPreviewLoading}
            title="See video plan, duration and cost before creating"
          >
            Preview Details
          </PreviewBtn>
        </div>
      </FocusedCard>
    </>,
    document.body
  );
};

export default IdeaFocusView;