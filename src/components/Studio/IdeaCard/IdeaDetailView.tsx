import React, { useState, useEffect } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType, VIDEO_MODELS } from '@models/VideoModel';
import GenerateButton from '../VideoGeneration/GenerateButton';
import { styles } from './styles';

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

  const handleTitleBlur = () => {
    if (title !== idea.title) {
      onUpdate(idea.id, { title });
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== idea.description) {
      onUpdate(idea.id, { description });
    }
  };

  const handlePromptBlur = () => {
    if (prompt !== idea.prompt) {
      onUpdate(idea.id, { prompt });
    }
  };

  const handleGenerate = () => {
    onGenerate({
      title,
      description,
      prompt,
      model: selectedModel,
    });
  };

  const model = VIDEO_MODELS[selectedModel];
  const modelClass = selectedModel === 'Veo 3' ? 'veo3' : 'veo2';

  return (
    <>
      <div style={styles.focusOverlay} onClick={onClose} />
      <div style={styles.ideaCardDetailed}>
        <div style={styles.detailedContent}>
          <div style={styles.detailedSidebar}>
            <div style={styles.sidebarTopGroup}>
              <div style={{ ...styles.modelDisplay, ...styles[`modelDisplay${modelClass.charAt(0).toUpperCase()}${modelClass.slice(1)}` as keyof typeof styles] }}>
                {selectedModel}
              </div>
              <div style={styles.priceDisplay}>
                <div style={styles.priceLabel}>Price</div>
                <div style={styles.priceValue}>
                  {model.price.toLocaleString()}
                  <span style={styles.priceUnit}>credits</span>
                </div>
              </div>
            </div>
            <GenerateButton onClick={handleGenerate} isGenerating={isGenerating} />
          </div>

          <div style={styles.detailedMain}>
            <div style={styles.detailedHeader}>
              <div style={styles.fieldLabel}>Title:</div>
              <input
                type="text"
                style={styles.detailedTitle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="Video title"
              />
              <div style={{ ...styles.fieldLabel, marginTop: '16px' }}>Description:</div>
              <textarea
                style={styles.detailedDescription}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                placeholder="Video description"
              />
            </div>

            <div style={styles.detailedSeparator} />

            <div style={styles.detailedPrompt}>
              <div style={styles.detailedPromptTitle}>Detailed scene production:</div>
              <div
                style={styles.detailedPromptText}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IdeaDetailView;