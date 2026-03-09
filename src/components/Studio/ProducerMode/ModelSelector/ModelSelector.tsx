import React, { useState, useRef, useEffect } from 'react';
import { VideoModelType, VIDEO_MODELS } from '@models/VideoModel';
import { SelectorContainer, ModelButton, Arrow, Dropdown, Option, OptionTitle, OptionDesc } from './styles';

interface ModelSelectorProps {
  selectedModel: VideoModelType;
  onModelChange: (model: VideoModelType) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const modelType = selectedModel === 'Veo 3' ? 'veo3' : 'veo2';
  
  return (
    <SelectorContainer ref={selectorRef}>
      <ModelButton
        $type={modelType}
        $isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedModel}</span>
        <Arrow $isOpen={isOpen}>▼</Arrow>
      </ModelButton>

      <Dropdown $isOpen={isOpen}>
        {Object.values(VIDEO_MODELS).map((model) => {
          const isSelected = model.id === selectedModel;
          const optionType = model.id === 'Veo 3' ? 'veo3' : 'veo2';
          
          return (
            <Option
              key={model.id}
              $selected={isSelected}
              $type={optionType}
              onClick={() => handleModelSelect(model.id)}
            >
              <OptionTitle>{model.name}</OptionTitle>
              <OptionDesc>
                {model.id === 'Veo 3' ? (
                  <>🚀 Best AI model to date<br />🔊 Supports sound</>
                ) : (
                  <>✨ Great AI model for simpler videos<br />🔇 No sound</>
                )}
              </OptionDesc>
            </Option>
          );
        })}
      </Dropdown>
    </SelectorContainer>
  );
};

export default ModelSelector;