import React, { useState } from 'react';
import { Post } from '@models/Post';
import { styles } from './styles';

interface FourDaysViewPostProps {
  post: Post;
  isHalf?: boolean;
}

const FourDaysViewPost: React.FC<FourDaysViewPostProps> = ({ post, isHalf = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isStatusHovered, setIsStatusHovered] = useState(false);
  const mediaEmoji = post.media === 'video' ? '🎥' : '🖼️';

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Published';
      case 'failed':
        return 'Failed';
      case 'scheduled':
        return 'Scheduled';
      default:
        return status;
    }
  };

  const postStyle = {
    ...styles.post,
    ...(isHalf ? styles.postHalf : {}),
    ...(isHovered ? styles.postHovered : {}),
  };

  return (
    <div style={postStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={styles.postHeader}>
        <div style={styles.postLeft}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                ...styles.statusIndicator,
                ...(post.status === 'success' ? styles.statusSuccess : {}),
                ...(post.status === 'failed' ? styles.statusFailed : {}),
                ...(post.status === 'scheduled' ? styles.statusScheduled : {}),
              }}
              onMouseEnter={() => setIsStatusHovered(true)}
              onMouseLeave={() => setIsStatusHovered(false)}
            />
            {isStatusHovered && (
              <div style={styles.statusTooltip}>
                {getStatusText(post.status)}
              </div>
            )}
          </div>
          <span style={styles.postTime}>{post.time}</span>
          <span style={styles.mediaIcon}>{mediaEmoji}</span>
        </div>
        <div style={styles.postRight}>
          {post.platforms.map((platform) => (
            <img
              key={platform}
              src={`/icons/social/${platform}.png`}
              alt={platform}
              style={styles.platformIcon}
              title={platform}
            />
          ))}
        </div>
      </div>
      <div style={styles.postTitle}>{post.title}</div>
    </div>
  );
};

export default FourDaysViewPost;