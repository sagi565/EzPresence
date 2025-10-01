import React, { useState } from 'react';
import { Post, PLATFORM_BADGES } from '@models/Post';
import { styles } from './styles';

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mediaEmoji = post.media === 'video' ? '🎥' : '🖼️';

  const postStyle = {
    ...styles.postItem,
    ...(isHovered ? {
      transform: 'translateX(2px)',
      boxShadow: '0 2px 6px rgba(155, 93, 229, 0.15)',
    } : {}),
  };

  return (
    <div
      style={postStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.postFirstLine}>
        <div style={styles.postLeft}>
          <div
            style={{
              ...styles.statusIndicator,
              ...(post.status === 'success' ? styles.statusSuccess : {}),
              ...(post.status === 'failed' ? styles.statusFailed : {}),
              ...(post.status === 'scheduled' ? styles.statusScheduled : {}),
            }}
          />
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

export default PostItem;