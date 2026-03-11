import React from 'react';
import type { DashboardComment } from '@/hooks/dashboard/useDashboardPosts';
import {
  CommentsContainer,
  EmptyComments,
  CommentItem,
  CommentAvatar,
  CommentContent,
  CommentHeader,
  CommentUser,
  CommentDate,
  CommentLikes,
  CommentText
} from './styles';

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
      <EmptyComments>
        No comments yet.
      </EmptyComments>
    );
  }

  return (
    <CommentsContainer>
      {comments.map((c, i) => (
        <CommentItem
          key={c.id}
          $even={i % 2 === 0}
        >
          {/* Avatar */}
          <CommentAvatar $hue={c.username.charCodeAt(0) * 37 % 360}>
            {c.username[0].toUpperCase()}
          </CommentAvatar>

          <CommentContent>
            <CommentHeader>
              <CommentUser>
                @{c.username}
              </CommentUser>
              <CommentDate>
                {timeAgo(c.publishedAt)}
              </CommentDate>
              {/* Likes — pushed to right */}
              {c.likes > 0 && (
                <CommentLikes>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {c.likes}
                </CommentLikes>
              )}
            </CommentHeader>
            <CommentText>
              {c.text}
            </CommentText>
          </CommentContent>
        </CommentItem>
      ))}
    </CommentsContainer>
  );
};

export default CommentsList;

