import React, { useState, useRef } from 'react';
import { styles } from './styles';

interface UploadButtonProps {
  listType: 'video' | 'image';
  onUpload: (file: File) => void;
  /** When provided, clicking navigates instead of opening a file dialog */
  onNavigate?: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ listType, onUpload, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Reset input to allow uploading same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // All upload buttons now use vertical format
  const buttonStyle = {
    ...styles.uploadButton,
    ...styles.uploadButtonVideo,
    ...(isHovered ? styles.uploadButtonHover : {}),
  };

  return (
    <>
      <div
        style={buttonStyle}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.uploadIcon}>➕</div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={listType === 'video' ? 'video/*' : 'image/*'}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadButton;