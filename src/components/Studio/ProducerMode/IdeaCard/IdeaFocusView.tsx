import React, { useState, useEffect } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { styles } from './styles';
import { theme } from '@/theme/theme';

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

  const buttonStyle = {
    ...styles.ideaPreviewBtn,
    ...(isButtonHovered ? {
      background: 'rgba(20, 184, 166, 0.05)',
      borderColor: theme.colors.teal,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)',
    } : {}),
  };

return (
  <>
    <div style={styles.focusOverlay} onClick={onClose} />
      <div style={styles.ideaCardFocused}>
        <textarea
          style={styles.ideaTextArea}
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showPreviewLoading && (
            <div className="loading-dots" style={styles.loadingDotsContainer}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <button
            style={buttonStyle}
            onClick={onPreviewDetails}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            disabled={showPreviewLoading}
            data-tooltip="See video plan, duration and cost before creating"
          >
            Preview Details
          </button>
        </div>
      </div>
    </>
  );
};


export default IdeaFocusView;