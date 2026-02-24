import React, { useState } from 'react';
import { Post } from '@models/Post';
import { styles } from './styles';

interface PostItemProps {
  post: Post;
  onClick: (post: Post) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isStatusHovered, setIsStatusHovered] = useState(false);
  const [isMediaHovered, setIsMediaHovered] = useState(false);
  const mediaEmoji = post.media === 'video' ? '🎥' : '🖼️';
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

  const postStyle = {
    ...styles.postItem,
    ...(isHovered ? {
      transform: 'translateX(2px)',
      boxShadow: '0 2px 6px rgba(155, 93, 229, 0.15)',
      cursor: 'pointer'
    } : {}),
  };

  return (
    <div
      style={postStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(post);
      }}
    >
      <div style={styles.postFirstLine}>
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

export default PostItem;