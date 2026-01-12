import React from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles';
import { ContentItem } from '@models/ContentList';
import { useContentUrl } from '@/hooks/contents/useContentUrl';

interface ContentDetailModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const { url: fetchedUrl } = useContentUrl(item.id);
  
  // Resolve source: Prioritize signed URL, fallback to thumbnail (properly decoded)
  const getSrc = () => {
    if (fetchedUrl) return fetchedUrl;
    if (item.thumbnail?.startsWith('http') || item.thumbnail?.startsWith('data:')) return item.thumbnail;
    if (item.thumbnail?.length > 50) return `data:image/jpeg;base64,${item.thumbnail}`;
    return null;
  };

  const src = getSrc();
  const isVideo = item.type === 'video';

  return ReactDOM.createPortal(
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        
        {/* Left: Media */}
        <div style={styles.mediaSection}>
          {src ? (
            isVideo ? (
              <video src={src} controls style={styles.mediaElement} autoPlay />
            ) : (
              <img src={src} alt={item.title} style={styles.mediaElement} />
            )
          ) : (
            <div style={{color: 'white'}}>Media not available</div>
          )}
        </div>

        {/* Right: Metadata */}
        <div style={styles.metaSection}>
          <h2 style={styles.title}>{item.title}</h2>
          <div style={styles.date}>Created on {new Date(item.createdAt || Date.now()).toLocaleDateString()}</div>
          
          <div style={styles.metaGrid}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Type</span>
              <span style={styles.metaValue}>{isVideo ? 'Video' : 'Image'}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Status</span>
              <span style={styles.metaValue}>{item.status || 'Ready'}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>ID</span>
              <span style={styles.metaValue} title={item.id}>
                {item.id.substring(0, 8)}...
              </span>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.actions}>
            <button style={styles.actionBtn}>
              <span>✏️</span> Rename
            </button>
            <button style={{...styles.actionBtn, ...styles.primaryBtn}}>
              <span>⬇️</span> Download
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ContentDetailModal;