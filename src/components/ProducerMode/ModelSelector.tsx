import React, { useState, useRef, useEffect } from 'react';
import { VideoModelType, VIDEO_MODELS } from '@models/VideoModel';
import { styles } from './styles';

interface ModelSelectorProps {
  selectedModel: VideoModelType;
  onModelChange: (model: VideoModelType) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectModel = (model: VideoModelType) => {
    onModelChange(model);
    setIsOpen(false);
  };

  const getModelClass = (model: VideoModelType) => {
    return model === 'Veo 3' ? 'veo3' : 'veo2';
  };

  return (
    <div ref={dropdownRef} style={styles.modelSelector}>
      <button
        style={{
          ...styles.modelButton,
          ...(getModelClass(selectedModel) === 'veo3' ? styles.modelButtonVeo3 : styles.modelButtonVeo2),
          ...(isOpen ? styles.modelButtonOpen : {}),
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedModel}</span>
        <span style={{ ...styles.arrow, ...(isOpen ? styles.arrowOpen : {}) }}>▼</span>
      </button>

      {isOpen && (
        <div style={styles.modelDropdown}>
          {(Object.keys(VIDEO_MODELS) as VideoModelType[]).map((modelKey) => {
            const model = VIDEO_MODELS[modelKey];
            const isSelected = modelKey === selectedModel;
            const modelClass = getModelClass(modelKey);

            return (
              <div
                key={modelKey}
                style={{
                  ...styles.modelOption,
                  ...(modelClass === 'veo3' ? styles.modelOptionVeo3 : styles.modelOptionVeo2),
                  ...(isSelected ? styles.modelOptionSelected : {}),
                  ...(isSelected && modelClass === 'veo3' ? styles.modelOptionSelectedVeo3 : {}),
                  ...(isSelected && modelClass === 'veo2' ? styles.modelOptionSelectedVeo2 : {}),
                }}
                onClick={() => handleSelectModel(modelKey)}
              >
                <div style={styles.modelOptionTitle}>{model.name}</div>
                <div style={styles.modelOptionDesc}>{model.description}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;