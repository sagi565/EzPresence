import React, { useState, useRef } from 'react';
import { styles } from './styles';

interface UploadButtonProps {
  listType: 'video' | 'image';
  onUpload: (file: File) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ listType, onUpload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const buttonStyle = {
    ...styles.uploadButton,
    ...(listType === 'video' ? styles.uploadButtonVideo : styles.uploadButtonImage),
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