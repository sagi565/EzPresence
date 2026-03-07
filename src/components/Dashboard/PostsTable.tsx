import React, { useState } from 'react';
import { theme } from '@theme/theme';
import type { DashboardPost } from '@/hooks/dashboard/useDashboardPosts';
import CommentsList from './CommentsList';

const platformColor: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  tiktok: '#010101',
  youtube: '#FF0000',
};

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
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const color = platformColor[post.platform] || theme.colors.primary;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 8px 32px rgba(0,0,0,0.13)'
          : '0 1px 6px rgba(0,0,0,0.07)',
        transition: 'all 0.22s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        animation: `fadeInUp 0.3s ease ${index * 0.07}s both`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',  // stretch to match tallest sibling in row
      }}
    >
      {/* ── Thumbnail ── */}
      <div style={{
        position: 'relative',
        height: 220,
        background: post.thumbnail,
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* Platform icon — top-right, no circle */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
        }}>
          <img
            src={`/icons/social/${post.platform}.png`}
            alt={post.platform}
            style={{
              width: 22, height: 22, objectFit: 'contain',
              filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.6)) brightness(1.1)',
            }}
          />
        </div>

        {/* Type badge + EZ badge — top-left in a row */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {/* Type */}
          <div style={{
            background: 'rgba(0,0,0,0.55)',
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '10px', fontWeight: 700,
            color: 'white', letterSpacing: '0.06em',
            backdropFilter: 'blur(4px)',
            textTransform: 'uppercase',
          }}>
            {post.type}
          </div>

          {/* EZ badge — purple-orange gradient, only if created by EzPresence */}
          {post.createdByEzPresence && (
            <div style={{
              background: 'linear-gradient(135deg, #9B5DE5 0%, #F15BB5 50%, #FF6B35 100%)',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '10px', fontWeight: 800,
              color: 'white', letterSpacing: '0.08em',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(155,93,229,0.45)',
            }}>
              EZ
            </div>
          )}
        </div>
      </div>

      {/* ── Below thumbnail ── */}
      <div style={{ padding: '14px 16px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Stats row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {formatNum(post.stats.likes)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: theme.colors.muted, fontSize: '13px', fontWeight: 600 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {formatNum(post.stats.comments)}
            </div>
          </div>
          <span style={{ fontSize: '12px', color: theme.colors.muted }}>
            {timeAgo(post.publishedAt)}
          </span>
        </div>

        {/* Caption */}
        <p style={{
          fontSize: '13px', color: theme.colors.text,
          margin: '0 0 14px', lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,           // push comments button to bottom
        }}>
          {post.caption}
        </p>
      </div>

      {/* ── Comments toggle ── */}
      <div style={{ borderTop: '1px solid #f3f4f6' }}>
        <button
          onClick={() => setCommentsOpen(o => !o)}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: commentsOpen ? color : theme.colors.muted,
            fontSize: '13px', fontWeight: 600,
            transition: 'color 0.15s',
          }}
        >
          <span>View {post.stats.comments} comment{post.stats.comments !== 1 ? 's' : ''}</span>
          {/* Chevron icon */}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{
              transform: commentsOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
              flexShrink: 0,
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {commentsOpen && <CommentsList comments={post.comments} />}
      </div>
    </div>
  );
};

// ── Loading skeleton ──────────────────────────────────────────────────────────
const CardSkeleton: React.FC = () => (
  <div style={{
    background: 'white', borderRadius: theme.borderRadius.lg,
    overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
  }}>
    <div className="shimmer" style={{ height: 220 }} />
    <div style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div className="shimmer" style={{ width: 60, height: 16 }} />
        <div className="shimmer" style={{ width: 50, height: 16 }} />
      </div>
      <div className="shimmer" style={{ width: '90%', height: 13, marginBottom: 6 }} />
      <div className="shimmer" style={{ width: '65%', height: 13, marginBottom: 14 }} />
    </div>
    <div style={{ borderTop: '1px solid #f3f4f6', padding: '12px 16px' }}>
      <div className="shimmer" style={{ width: 120, height: 13 }} />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
interface PostsTableProps {
  posts: DashboardPost[];
  loading: boolean;
}

const PostsTable: React.FC<PostsTableProps> = ({ posts, loading }) => {
  const visible = posts.slice(0, 3);

  return (
    <div style={{
      background: 'white', borderRadius: theme.borderRadius.lg,
      padding: '24px', boxShadow: theme.shadows.md,
    }}>
      {/* 3-column card grid — align-items:stretch so all cards match the tallest */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : visible.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
        }
      </div>
    </div>
  );
};

export default PostsTable;
