import React, { useState } from 'react';
import { Post } from '@models/Post';
import { Repeat } from 'lucide-react';
import {
  PostCard,
  PostHeader,
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

interface FourDaysViewPostProps {
  post: Post;
  isHalf?: boolean;
  onClick?: (post: Post) => void;
}

const FourDaysViewPost: React.FC<FourDaysViewPostProps> = ({ post, isHalf = false, onClick }) => {
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

  return (
    <PostCard 
      $isHalf={isHalf}
      style={{
        cursor: onClick ? 'pointer' : undefined,
        ...(policyBg ? { background: policyBg } : {}),
        ...(policyAccent ? { borderLeft: `3px solid ${policyAccent}` } : {}),
      }} 
      onClick={() => onClick?.(post)}
    >
      <PostHeader>
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
              <Repeat
                size={14}
                color="#000"
                strokeWidth={2.5}
                style={{ opacity: 0.7 }}
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
      </PostHeader>
      <PostTitleWrapper>{post.title}</PostTitleWrapper>
    </PostCard>
  );
};

export default FourDaysViewPost;