import React, { useState } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType } from '@models/VideoModel';
import IdeaFocusView from './IdeaFocusView';
import IdeaDetailView from './IdeaDetailView';
import { styles } from './styles';

interface IdeaCardProps {
  idea: VideoIdea;
  selectedModel: VideoModelType;
  onUpdate: (ideaId: string, updates: Partial<VideoIdea>) => void;
  onGenerate: (params: any) => Promise<boolean>;
  isGenerating: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  selectedModel,
  onUpdate,
  onGenerate,
  isGenerating,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showPreviewLoading, setShowPreviewLoading] = useState(false);

  const handleClick = () => {
    setIsFocused(true);
  };

  const handleClose = () => {
    setIsFocused(false);
    setShowDetail(false);
  };

  const handlePreviewDetails = async () => {
    setShowPreviewLoading(true);
    await new Promise(resolve => setTimeout(resolve, 5000));
    setShowPreviewLoading(false);
    setShowDetail(true);
  };

  const cardStyle = {
    ...styles.ideaCard,
    ...(isHovered ? styles.ideaCardHover : {}),
  };

  if (showDetail) {
    return (
      <IdeaDetailView
        idea={idea}
        selectedModel={selectedModel}
        onUpdate={onUpdate}
        onGenerate={onGenerate}
        onClose={handleClose}
        isGenerating={isGenerating}
      />
    );
  }

  if (isFocused) {
    return (
      <IdeaFocusView
        idea={idea}
        onUpdate={onUpdate}
        onClose={handleClose}
        onPreviewDetails={handlePreviewDetails}
        showPreviewLoading={showPreviewLoading}
      />
    );
  }

  return (
    <div
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={styles.ideaText}>{idea.idea}</span>
    </div>
  );
};

export default IdeaCard;