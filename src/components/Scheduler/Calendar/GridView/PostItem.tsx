import React, { useState, useRef } from 'react';
import { Post } from '@models/Post';
import PolicyRepeatIcon from '../PolicyRepeatIcon';
import {
  PostItemContainer,
  PostFirstLine,
  PostLeft,
  PostRight,
  StatusIndicator,
  BlackTooltip,
  PostTime,
  MediaIcon,
  PostTitleWrapper,
  PlatformIcon
} from './styles';
import { getPolicyBackground, getPolicyAccent } from '@utils/policyColors';

interface PostItemProps {
  post: Post;
  onClick: (post: Post) => void;
  onPostContextMenu?: (post: Post, x: number, y: number) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onClick, onPostContextMenu }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isStatusHovered, setIsStatusHovered] = useState(false);
  const [isMediaHovered, setIsMediaHovered] = useState(false);
  const [isRepeatHovered, setIsRepeatHovered] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const policyBg = post.isRecurring ? getPolicyBackground(post.scheduleUuid) : null;
  const policyAccent = post.isRecurring ? getPolicyAccent(post.scheduleUuid) : null;

  return (
    <PostItemContainer
      style={{
        ...(policyBg ? { background: policyBg } : {}),
        ...(policyAccent ? { borderLeft: `3px solid ${policyAccent}` } : {}),
        ...(isHovered ? {
          transform: 'translateX(2px)',
          boxShadow: '0 2px 6px rgba(155, 93, 229, 0.15)'
        } : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(post);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onPostContextMenu?.(post, e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        longPressTimer.current = setTimeout(() => {
          onPostContextMenu?.(post, x, y);
        }, 500);
      }}
      onTouchMove={() => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
      }}
      onTouchEnd={() => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
      }}
    >
      <PostFirstLine>
        <PostLeft>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              onMouseEnter={() => setIsStatusHovered(true)}
              onMouseLeave={() => setIsStatusHovered(false)}
            >
              <StatusIndicator $status={post.status} />
            </div>
            {isStatusHovered && (
              <BlackTooltip>
                {getStatusText(post.status)}
              </BlackTooltip>
            )}
          </div>
          <PostTime>{post.time}</PostTime>
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
              <PolicyRepeatIcon
                size={14}
                color="#000"
                style={{ opacity: 0.8 }}
              />
              {isRepeatHovered && (
                <BlackTooltip>Repeat {post.type}</BlackTooltip>
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
            <MediaIcon
              onMouseEnter={() => setIsMediaHovered(true)}
              onMouseLeave={() => setIsMediaHovered(false)}
            >
              {mediaEmoji}
              {isMediaHovered && (
                <BlackTooltip>{mediaText}</BlackTooltip>
              )}
            </MediaIcon>
          </div>
        </PostLeft>
        <PostRight>
          {post.platforms.map((platform) => (
            <PlatformIcon
              key={platform}
              src={`/icons/social/${platform}.png`}
              alt={platform}
              title={platform}
            />
          ))}
        </PostRight>
      </PostFirstLine>
      <PostTitleWrapper>{post.title}</PostTitleWrapper>
    </PostItemContainer>
  );
};

export default PostItem;