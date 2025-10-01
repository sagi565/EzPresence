import React, { useState } from 'react';
import { Post, PLATFORM_BADGES } from '@models/Post';
import { styles } from './styles';

interface ListViewPostProps {
  post: Post;
  isHalf?: boolean;
}

const ListViewPost: React.FC<ListViewPostProps> = ({ post, isHalf = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mediaEmoji = post.media === 'video' ? '🎥' : '🖼️';

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

export default ListViewPost;