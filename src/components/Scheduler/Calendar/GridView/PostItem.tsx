import React, { useState } from 'react';
import { Post } from '@models/Post';
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
}

const PostItem: React.FC<PostItemProps> = ({ post, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isStatusHovered, setIsStatusHovered] = useState(false);
  const [isMediaHovered, setIsMediaHovered] = useState(false);
  const [isRepeatHovered, setIsRepeatHovered] = useState(false);
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
              <img
                src="/icons/repeat.png"
                alt="Recurring"
                style={{ width: '12px', height: '12px', objectFit: 'contain', opacity: 0.7 }}
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