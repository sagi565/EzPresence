import React, { useState, useRef } from 'react';
import { 
  UploadButtonContainer, 
  UploadIcon 
} from './styles';
import { useIsMobile } from '@/hooks/useIsMobile';

interface UploadButtonProps {
  listType: 'video' | 'image';
  onUpload: (file: File) => void;
  /** When provided, clicking navigates instead of opening a file dialog */
  onNavigate?: () => void;
  /** When true, accepts both video and image file types */
  acceptBoth?: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ listType, onUpload, onNavigate, acceptBoth }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <UploadButtonContainer
        $isHovered={isHovered}
        $isMobile={isMobile}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <UploadIcon $isMobile={isMobile}>➕</UploadIcon>
      </UploadButtonContainer>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptBoth ? 'video/*,image/*' : listType === 'video' ? 'video/*' : 'image/*'}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadButton;