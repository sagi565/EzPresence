import React, { useState, useRef, useEffect } from 'react';
import { VideoModelType, VIDEO_MODELS } from '@models/VideoModel';
import { styles } from './styles';

interface ModelSelectorProps {
  selectedModel: VideoModelType;
  onModelChange: (model: VideoModelType) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<VideoModelType | null>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
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

  const handleModelSelect = (model: VideoModelType) => {
    onModelChange(model);
    setIsOpen(false);
  };

  const modelClass = selectedModel === 'Veo 3' ? 'veo3' : 'veo2';
  
  const buttonStyle = {
    ...styles.modelButton,
    ...styles[`modelButton${modelClass.charAt(0).toUpperCase()}${modelClass.slice(1)}` as keyof typeof styles],
    ...(isOpen ? styles.modelButtonOpen : {}),
    ...(isButtonHovered ? styles[`modelButton${modelClass.charAt(0).toUpperCase()}${modelClass.slice(1)}Hover` as keyof typeof styles] : {}),
  };

  const dropdownStyle = {
    ...styles.modelDropdown,
    ...(isOpen ? styles.modelDropdownOpen : {}),
  };

  return (
    <div ref={selectorRef} style={styles.modelSelector}>
      <button
        style={buttonStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        <span>{selectedModel}</span>
        <span style={{ ...styles.arrow, ...(isOpen ? styles.arrowOpen : {}) }}>▼</span>
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          {Object.values(VIDEO_MODELS).map((model) => {
            const isSelected = model.id === selectedModel;
            const isHovered = hoveredOption === model.id;
            const optionClass = model.id === 'Veo 3' ? 'veo3' : 'veo2';
            
            const optionStyle = {
              ...styles.modelOption,
              ...styles[`modelOption${optionClass.charAt(0).toUpperCase()}${optionClass.slice(1)}` as keyof typeof styles],
              ...(isSelected ? styles[`modelOptionSelected${optionClass.charAt(0).toUpperCase()}${optionClass.slice(1)}` as keyof typeof styles] : {}),
              ...(isHovered ? styles[`modelOption${optionClass.charAt(0).toUpperCase()}${optionClass.slice(1)}Hover` as keyof typeof styles] : {}),
            };

            return (
              <div
                key={model.id}
                style={optionStyle}
                onClick={() => handleModelSelect(model.id)}
                onMouseEnter={() => setHoveredOption(model.id)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <div style={styles.modelOptionTitle}>{model.name}</div>
                <div style={styles.modelOptionDesc}>
                  {model.id === 'Veo 3' ? (
                    <>🚀 Best AI model to date<br />🔊 Supports sound</>
                  ) : (
                    <>✨ Great AI model for simpler videos<br />🔇 No sound</>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;