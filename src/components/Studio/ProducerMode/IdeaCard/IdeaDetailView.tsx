import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType, VIDEO_MODELS } from '@models/VideoModel';
import GenerateButton from '../VideoGeneration/GenerateButton';
import { 
  Overlay, 
  DetailedModal, 
  DetailedContent, 
  DetailedMain, 
  DetailedSidebar,
  SidebarTopGroup,
  FieldLabel,
  DetailedInput,
  DetailedTextArea,
  DetailedSeparator,
  DetailedPromptContainer,
  DetailedPromptTitle,
  DetailedPromptText,
  ModelBadge,
  PriceDisplay,
  PriceLabel,
  PriceValue,
  PriceUnit
} from './styles';

interface IdeaDetailViewProps {
  idea: VideoIdea;
  selectedModel: VideoModelType;
  onUpdate: (ideaId: string, updates: Partial<VideoIdea>) => void;
  onGenerate: (params: any) => Promise<boolean>;
  onClose: () => void;
  isGenerating: boolean;
}

const IdeaDetailView: React.FC<IdeaDetailViewProps> = ({
  idea,
  selectedModel,
  onUpdate,
  onGenerate,
  onClose,
  isGenerating,
}) => {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);
  const [prompt, setPrompt] = useState(idea.prompt);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleGenerate = () => {
    onGenerate({
      title,
      description,
      prompt,
      model: selectedModel,
    });
  };

  const model = VIDEO_MODELS[selectedModel];
  const modelType = selectedModel === 'Veo 3' ? 'veo3' : 'veo2';

  return ReactDOM.createPortal( 
    <>
      <Overlay onClick={onClose} />
      <DetailedModal>
        <DetailedContent>
          <DetailedMain>
            <div>
              <FieldLabel>Title:</FieldLabel>
              <DetailedInput
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video title"
              />
              <FieldLabel style={{ marginTop: '16px' }}>Description:</FieldLabel>
              <DetailedTextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Video description"
              />
            </div>

            <DetailedSeparator />

            <DetailedPromptContainer>
              <DetailedPromptTitle>Detailed scene production:</DetailedPromptTitle>
              <DetailedPromptText
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newPrompt = e.currentTarget.textContent || '';
                  if (newPrompt !== prompt) {
                    setPrompt(newPrompt);
                    onUpdate(idea.id, { prompt: newPrompt });
                  }
                }}
              >
                {prompt}
              </DetailedPromptText>
            </DetailedPromptContainer>
          </DetailedMain>
          
          <DetailedSidebar>
            <SidebarTopGroup>
              <ModelBadge className="model-display-shimmer" $type={modelType}>
                {selectedModel}
              </ModelBadge>
              <PriceDisplay>
                <PriceLabel>Price</PriceLabel>
                <PriceValue>
                  {model.price.toLocaleString()}
                  <PriceUnit>credits</PriceUnit>
                </PriceValue>
              </PriceDisplay>
            </SidebarTopGroup>
            
            <GenerateButton 
              onClick={handleGenerate} 
              isGenerating={isGenerating}
              onClose={onClose}
            /> 
          </DetailedSidebar>
        </DetailedContent>
      </DetailedModal>
    </>, 
    document.body
  );
};

export default IdeaDetailView;