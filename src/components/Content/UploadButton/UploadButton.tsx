import React, { useCallback, useRef, useState } from 'react';
import { styles } from './styles';

interface UploadButtonProps {
  listType: 'video' | 'image';
  onUpload: (file: File) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ listType, onUpload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Counter trick prevents flickering when dragging over child elements
  const dragCounter = useRef(0);

  const accept = listType === 'video' ? 'video/*' : 'image/*';
  const mimePrefix = listType === 'video' ? 'video/' : 'image/';

  // ── Click to open file dialog ──────────────────────────────────────────────
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    // Reset so the same file can be uploaded again
    e.target.value = '';
  };

  // ── OS drag-and-drop ───────────────────────────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragOver(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragOver(false);

      const file = Array.from(e.dataTransfer.files).find((f) =>
        f.type.startsWith(mimePrefix)
      );
      if (file) onUpload(file);
    },
    [mimePrefix, onUpload]
  );

  // ── Styles ─────────────────────────────────────────────────────────────────
  const buttonStyle = {
    ...styles.uploadButton,
    ...(isHovered && !isDragOver ? styles.uploadButtonHover : {}),
    ...(isDragOver ? styles.uploadButtonDragOver : {}),
  };

  const label = listType === 'video' ? 'video or drag & drop' : 'image or drag & drop';

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${listType}`}
        style={buttonStyle}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleClick() : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Animated ring when drag-over */}
        {isDragOver && <div style={styles.dragRing} />}

        <div style={styles.uploadInner}>
          <div style={{
            ...styles.uploadIconWrapper,
            ...(isDragOver ? styles.uploadIconWrapperActive : {}),
          }}>
            <span style={styles.uploadIcon}>{isDragOver ? '📥' : '+'}</span>
          </div>
          <p style={styles.uploadTitle}>
            {isDragOver ? 'Drop to upload' : 'Click to add content'}
          </p>
          <p style={styles.uploadSubtitle}>
            {isDragOver ? 'Release to upload your file' : label}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadButton;