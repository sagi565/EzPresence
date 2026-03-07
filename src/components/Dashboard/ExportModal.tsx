import React, { useState } from 'react';
import { theme } from '@theme/theme';
import type { DashboardStats } from '@/hooks/dashboard/useDashboardStats';
import type { DashboardPost } from '@/hooks/dashboard/useDashboardPosts';

interface ExportModalProps {
  stats: DashboardStats | null;
  posts: DashboardPost[];
  platforms: string[];
  timeRange: string;
  onClose: () => void;
}

type ExportSection = 'timeSeries' | 'totals' | 'posts' | 'comments';

const SECTIONS: { id: ExportSection; label: string; description: string; icon: string }[] = [
  {
    id: 'timeSeries',
    label: 'Daily Stats',
    description: 'Views, likes, shares, posts — one row per day',
    icon: '📈',
  },
  {
    id: 'totals',
    label: 'Summary Totals',
    description: 'Aggregate totals and % change for the period',
    icon: '🔢',
  },
  {
    id: 'posts',
    label: 'Posts List',
    description: 'All posts with platform, type, caption, and engagement',
    icon: '📝',
  },
  {
    id: 'comments',
    label: 'Comments',
    description: 'All comments for the visible posts',
    icon: '💬',
  },
];

function escapeCsv(value: string | number | undefined): string {
  if (value === undefined || value === null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers: string[], rows: (string | number)[][]): string {
  const headerRow = headers.map(escapeCsv).join(',');
  const dataRows = rows.map(row => row.map(escapeCsv).join(','));
  return [headerRow, ...dataRows].join('\n');
}

function download(filename: string, csv: string) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

const ExportModal: React.FC<ExportModalProps> = ({
  stats, posts, platforms, timeRange, onClose,
}) => {
  const [selected, setSelected] = useState<Set<ExportSection>>(
    new Set(['timeSeries', 'posts']),
  );
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const toggleSection = (id: ExportSection) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleExport = () => {
    setExporting(true);
    const dateStr = new Date().toISOString().split('T')[0];
    const platformStr = platforms.join('-') || 'all';
    let delay = 0;

    if (selected.has('timeSeries') && stats) {
      setTimeout(() => {
        const csv = toCsv(
          ['Date', 'Views', 'Likes', 'Shares', 'Posts', 'Comments'],
          stats.timeSeries.map(d => [d.date, d.views, d.likes, d.shares, d.posts, d.comments]),
        );
        download(`daily_stats_${platformStr}_${timeRange}_${dateStr}.csv`, csv);
      }, delay);
      delay += 400;
    }

    if (selected.has('totals') && stats) {
      setTimeout(() => {
        const t = stats.totals;
        const dt = stats.deltas;
        const csv = toCsv(
          ['Metric', 'Total', '% Change vs Prev Period'],
          [
            ['Views', t.views, `${dt.views}%`],
            ['Likes', t.likes, `${dt.likes}%`],
            ['Shares', t.shares, `${dt.shares}%`],
            ['Posts', t.posts, `${dt.posts}%`],
            ['Comments', t.comments, `${dt.comments}%`],
          ],
        );
        download(`summary_${platformStr}_${timeRange}_${dateStr}.csv`, csv);
      }, delay);
      delay += 400;
    }

    if (selected.has('posts')) {
      setTimeout(() => {
        const csv = toCsv(
          ['ID', 'Platform', 'Type', 'Caption', 'Published At', 'Views', 'Likes', 'Shares', 'Comments'],
          posts.map(p => [
            p.id, p.platform, p.type, p.caption,
            new Date(p.publishedAt).toLocaleString(),
            p.stats.views, p.stats.likes, p.stats.shares, p.stats.comments,
          ]),
        );
        download(`posts_${platformStr}_${dateStr}.csv`, csv);
      }, delay);
      delay += 400;
    }

    if (selected.has('comments')) {
      setTimeout(() => {
        const rows: (string | number)[][] = [];
        posts.forEach(p => {
          p.comments.forEach(c => {
            rows.push([p.id, p.platform, c.username, c.text, new Date(c.publishedAt).toLocaleString()]);
          });
        });
        const csv = toCsv(['Post ID', 'Platform', 'Username', 'Comment', 'Date'], rows);
        download(`comments_${platformStr}_${dateStr}.csv`, csv);
      }, delay);
      delay += 400;
    }

    setTimeout(() => {
      setExporting(false);
      setDone(true);
      setTimeout(() => { setDone(false); onClose(); }, 1200);
    }, delay + 200);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 2000,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2001,
        width: 480, maxWidth: '95vw',
        background: 'white',
        borderRadius: theme.borderRadius.lg,
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        animation: 'focusAppear 0.2s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: theme.gradients.momentum,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'white' }}>
              Export to Excel
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
              Choose what to include in the export
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none',
              borderRadius: '50%', width: 32, height: 32,
              cursor: 'pointer', color: 'white', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Sections */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: '12px', color: theme.colors.muted, margin: '0 0 4px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Select sheets to export
          </p>

          {SECTIONS.map(section => {
            const isSelected = selected.has(section.id);
            const isDisabled = section.id === 'timeSeries' && !stats;

            return (
              <label
                key={section.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  border: `1.5px solid ${isSelected ? theme.colors.primary : '#e5e7eb'}`,
                  borderRadius: theme.borderRadius.md,
                  background: isSelected ? `${theme.colors.primary}08` : '#fafafa',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  transition: 'all 0.15s',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => !isDisabled && toggleSection(section.id)}
                  style={{ display: 'none' }}
                />
                {/* Custom checkbox */}
                <div style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${isSelected ? theme.colors.primary : '#d1d5db'}`,
                  background: isSelected ? theme.colors.primary : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {isSelected && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                <span style={{ fontSize: '22px', flexShrink: 0 }}>{section.icon}</span>

                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: theme.colors.text }}>
                    {section.label}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.colors.muted, marginTop: 1 }}>
                    {section.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex', gap: 10, justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px', borderRadius: theme.borderRadius.md,
              border: '1.5px solid #e5e7eb', background: 'white',
              color: theme.colors.muted, fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!selected.size || exporting || done}
            style={{
              padding: '9px 24px', borderRadius: theme.borderRadius.md,
              border: 'none',
              background: done ? '#14b8a6' : theme.gradients.momentum,
              color: 'white', fontWeight: 700, fontSize: '14px',
              cursor: !selected.size || exporting || done ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'opacity 0.2s',
              opacity: !selected.size ? 0.5 : 1,
            }}
          >
            {done ? '✅ Done!' : exporting ? '⏳ Exporting…' : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export {selected.size} Sheet{selected.size !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ExportModal;
