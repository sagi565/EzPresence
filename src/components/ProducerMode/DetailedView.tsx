import React, { useState } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType, VIDEO_MODELS } from '@models/VideoModel';
import { useVideoGeneration } from '@hooks/useVideoGeneration';
import ConfirmationDialog from './ConfirmationDialog';
import CelebrationAnimation from './CelebrationAnimation';
import { styles } from './styles';

interface DetailedViewProps {
  idea: VideoIdea;
  selectedModel: VideoModelType;
  onClose: () => void;
}

const DetailedView: React.FC<DetailedViewProps> = ({ idea, selectedModel, onClose }) => {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);
  const [prompt, setPrompt] = useState(idea.prompt);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { generateVideo } = useVideoGeneration();

  const model = VIDEO_MODELS[selectedModel];

  const handleGenerate = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    
    const success = await generateVideo({
      title,
      description,
      prompt,
      model: selectedModel,
    });

    if (success) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onClose();
      }, 2500);
    }
  };

  const getModelClass = (model: VideoModelType) => {
    return model === 'Veo 3' ? 'veo3' : 'veo2';
  };

  return (
    <>
      <div style={styles.focusOverlay} onClick={onClose} />
      <div style={styles.detailedCard}>
        <div style={styles.detailedContent}>
          <div style={styles.detailedSidebar}>
            <div style={styles.sidebarTopGroup}>
              <div
                style={{
                  ...styles.modelDisplay,
                  ...(getModelClass(selectedModel) === 'veo3' ? styles.modelDisplayVeo3 : styles.modelDisplayVeo2),
                }}
              >
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

            <button style={styles.generateBtn} onClick={handleGenerate}>
              <span style={styles.generateBtnIcon}>🎬</span>
              <span>Generate!</span>
            </button>
          </div>

          <div style={styles.detailedMain}>
            <div style={styles.detailedHeader}>
              <div style={styles.fieldLabel}>Title:</div>
              <input
                type="text"
                style={styles.detailedTitle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video title"
              />

              <div style={styles.fieldLabel}>Description:</div>
              <textarea
                style={styles.detailedDescription}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                onBlur={(e) => setPrompt(e.currentTarget.textContent || '')}
              >
                {prompt}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          price={model.price}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {showCelebration && <CelebrationAnimation />}
    </>
  );
};

export default DetailedView;