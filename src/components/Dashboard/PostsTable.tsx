import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { Theme } from '@theme/theme';
import type { DashboardPost } from '@/hooks/dashboard/useDashboardPosts';
import CommentsList from './CommentsList';
import {
  PostsContainer,
  PostsGrid,
  PostCardContainer,
  PostThumbnailWrapper,
  PlatformBadge,
  PlatformIconBadge,
  BadgesContainer,
  TypeBadge,
  EzBadge,
  PostContent,
  StatsRow,
  StatsGroup,
  StatItem,
  PublishedDate,
  PostCaption,
  CommentsToggleWrapper,
  CommentsToggleButton,
  ChevronIcon,
  ShimmerBase
} from './styles';

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

interface PostCardProps {
  post: DashboardPost;
  index: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  const theme = useTheme() as Theme;
  const isDark = theme.colors.bg === '#0a0e17';
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const platformColor: Record<string, string> = {
    instagram: '#E1306C',
    facebook: '#1877F2',
    tiktok: isDark ? '#333333' : '#010101',
    youtube: '#FF0000',
  };

  const color = platformColor[post.platform] || theme.colors.primary;

  return (
    <PostCardContainer
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      $hovered={hovered}
      $index={index}
    >
      {/* ── Thumbnail ── */}
      <PostThumbnailWrapper
        onClick={() => {
          if (post.embedLink) {
            window.open(post.embedLink, '_blank', 'noopener,noreferrer');
          }
        }}
        $bg={post.thumbnail}
        $isClickable={!!post.embedLink}
        title={post.embedLink ? "Click to view on platform" : undefined}
      >
        {/* Platform icon — top-right, no circle */}
        <PlatformBadge>
          <PlatformIconBadge
            src={`/icons/social/${post.platform}.png`}
            alt={post.platform}
          />
        </PlatformBadge>

        {/* Type badge + EZ badge — top-left in a row */}
        <BadgesContainer>
          {/* Type */}
          <TypeBadge>
            {post.type}
          </TypeBadge>

          {/* EZ badge — purple-orange gradient, only if created by EzPresence */}
          {post.createdByEzPresence && (
            <EzBadge>
              EZ
            </EzBadge>
          )}
        </BadgesContainer>
      </PostThumbnailWrapper>

      {/* ── Below thumbnail ── */}
      <PostContent>

        {/* Stats row */}
        <StatsRow>
          <StatsGroup>
            <StatItem $color={theme.colors.pink}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {formatNum(post.stats.likes)}
            </StatItem>
            <StatItem>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {formatNum(post.stats.comments)}
            </StatItem>
          </StatsGroup>
          <PublishedDate>
            {timeAgo(post.publishedAt)}
          </PublishedDate>
        </StatsRow>

        {/* Caption */}
        <PostCaption>
          {post.caption}
        </PostCaption>
      </PostContent>

      {/* ── Comments toggle ── */}
      <CommentsToggleWrapper>
        <CommentsToggleButton
          onClick={() => setCommentsOpen(o => !o)}
          $active={commentsOpen}
          $color={color}
        >
          <span>View {post.stats.comments} comment{post.stats.comments !== 1 ? 's' : ''}</span>
          {/* Chevron icon */}
          <ChevronIcon
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            $open={commentsOpen}
          >
            <polyline points="6 9 12 15 18 9" />
          </ChevronIcon>
        </CommentsToggleButton>

        {commentsOpen && <CommentsList comments={post.comments} />}
      </CommentsToggleWrapper>
    </PostCardContainer>
  );
};

// ── Loading skeleton ──────────────────────────────────────────────────────────
const CardSkeleton: React.FC = () => (
  <PostCardContainer $hovered={false} $index={0}>
    <ShimmerBase style={{ height: 220, borderRadius: 0 }} />
    <PostContent style={{ paddingBottom: 14 }}>
      <StatsGroup style={{ marginBottom: 12 }}>
        <ShimmerBase style={{ width: 60, height: 16 }} />
        <ShimmerBase style={{ width: 50, height: 16 }} />
      </StatsGroup>
      <ShimmerBase style={{ width: '90%', height: 13, marginBottom: 6 }} />
      <ShimmerBase style={{ width: '65%', height: 13, marginBottom: 14 }} />
    </PostContent>
    <CommentsToggleWrapper style={{ padding: '12px 16px' }}>
      <ShimmerBase style={{ width: 120, height: 13 }} />
    </CommentsToggleWrapper>
  </PostCardContainer>
);

// ── Main component ────────────────────────────────────────────────────────────
interface PostsTableProps {
  posts: DashboardPost[];
  loading: boolean;
}

const PostsTable: React.FC<PostsTableProps> = ({ posts, loading }) => {
  const visible = posts.slice(0, 3);

  return (
    <PostsContainer>
      {/* 3-column card grid — align-items:stretch so all cards match the tallest */}
      <PostsGrid>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : visible.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
        }
      </PostsGrid>
    </PostsContainer>
  );
};

export default PostsTable;

