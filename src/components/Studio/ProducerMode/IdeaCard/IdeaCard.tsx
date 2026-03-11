import React, { useState } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType } from '@models/VideoModel';
import IdeaFocusView from './IdeaFocusView';
import IdeaDetailView from './IdeaDetailView';
import { CardContainer, IdeaText } from './styles';

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

  return (
    <>
      <CardContainer
        $isHovered={isHovered}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IdeaText>{idea.idea}</IdeaText>
      </CardContainer>

      {isFocused && !showDetail && (
        <IdeaFocusView
          idea={idea}
          onUpdate={onUpdate}
          onClose={handleClose}
          onPreviewDetails={handlePreviewDetails}
          showPreviewLoading={showPreviewLoading}
        />
      )}

      {showDetail && (
        <IdeaDetailView
          idea={idea}
          selectedModel={selectedModel}
          onUpdate={onUpdate}
          onGenerate={onGenerate}
          onClose={handleClose}
          isGenerating={isGenerating}
        />
      )}
    </>
  );
};

export default IdeaCard;