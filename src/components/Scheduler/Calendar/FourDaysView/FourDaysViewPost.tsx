import React, { useState } from 'react';
import { Post } from '@models/Post';
import { styles } from './styles';
import { getPolicyBackground, getPolicyAccent } from '@utils/policyColors';

interface FourDaysViewPostProps {
  post: Post;
  isHalf?: boolean;
  onClick?: (post: Post) => void;
}

const FourDaysViewPost: React.FC<FourDaysViewPostProps> = ({ post, isHalf = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isStatusHovered, setIsStatusHovered] = useState(false);
  const mediaEmoji = post.media === 'video' ? '🎥' : '🖼️';

  const [isMediaHovered, setIsMediaHovered] = useState(false);
  const [isRepeatHovered, setIsRepeatHovered] = useState(false);
  const mediaText = post.media === 'video' ? 'Video' : 'Image';

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Published';
      case 'failed':
        return 'Failed';
      case 'scheduled':
        return 'Scheduled';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  const policyBg = post.isRecurring ? getPolicyBackground(post.scheduleUuid) : null;
  const policyAccent = post.isRecurring ? getPolicyAccent(post.scheduleUuid) : null;

  const postStyle = {
    ...styles.post,
    ...(isHalf ? styles.postHalf : {}),
    ...(policyBg ? { background: policyBg } : {}),
    ...(policyAccent ? { borderLeft: `3px solid ${policyAccent}` } : {}),
    ...(isHovered ? styles.postHovered : {}),
  };

  return (
    <div style={{ ...postStyle, cursor: onClick ? 'pointer' : undefined }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => onClick?.(post)}>
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
                ...(post.status === 'draft' ? styles.statusDraft : {}),
              }}
              onMouseEnter={() => setIsStatusHovered(true)}
              onMouseLeave={() => setIsStatusHovered(false)}
            />
            {isStatusHovered && (
              <div style={styles.blackTooltip}>
                {getStatusText(post.status)}
              </div>
            )}
          </div>
          <span style={styles.postTime}>{post.time}</span>
          {post.isRecurring && (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={() => setIsRepeatHovered(true)}
              onMouseLeave={() => setIsRepeatHovered(false)}
            >
              <img
                src="/icons/repeat.png"
                alt="Recurring"
                style={{ width: '12px', height: '12px', objectFit: 'contain', opacity: 0.7 }}
              />
              {isRepeatHovered && (
                <div style={styles.blackTooltip}>Repeat {post.type}</div>
              )}
            </div>
          )}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={styles.mediaIcon}
              onMouseEnter={() => setIsMediaHovered(true)}
              onMouseLeave={() => setIsMediaHovered(false)}
            >
              {mediaEmoji}
              {isMediaHovered && (
                <div style={styles.blackTooltip}>{mediaText}</div>
              )}

            </span>
          </div>
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