import React from 'react';
import { theme } from '@theme/theme';
import type { DashboardComment } from '@/hooks/dashboard/useDashboardPosts';

interface CommentsListProps {
  comments: DashboardComment[];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  if (!comments.length) {
    return (
      <div style={{
        padding: '16px 20px',
        color: theme.colors.muted,
        fontSize: '13px',
        fontStyle: 'italic',
      }}>
        No comments yet.
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      borderTop: '1px solid #f3f4f6',
      animation: 'fadeInUp 0.2s ease',
    }}>
      {comments.map((c, i) => (
        <div
          key={c.id}
          style={{
            display: 'flex',
            gap: '10px',
            padding: '12px 16px',
            background: i % 2 === 0 ? '#fafafa' : 'white',
            alignItems: 'flex-start',
          }}
        >
          {/* Avatar */}
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            flexShrink: 0,
            background: `hsl(${c.username.charCodeAt(0) * 37 % 360}, 65%, 70%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: 'white',
          }}>
            {c.username[0].toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: theme.colors.text }}>
                @{c.username}
              </span>
              <span style={{ fontSize: '11px', color: theme.colors.muted }}>
                {timeAgo(c.publishedAt)}
              </span>
              {/* Likes — pushed to right */}
              {c.likes > 0 && (
                <span style={{
                  marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: '12px', fontWeight: 600, color: '#ef4444',
                  flexShrink: 0,
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {c.likes}
                </span>
              )}
            </div>
            <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.4 }}>
              {c.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
