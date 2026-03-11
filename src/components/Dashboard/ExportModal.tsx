import React, { useState } from 'react';
import type { DashboardStats } from '@/hooks/dashboard/useDashboardStats';
import type { DashboardPost } from '@/hooks/dashboard/useDashboardPosts';
import {
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalHeaderContent,
  ModalTitle,
  ModalSubtitle,
  CloseButton,
  ModalBody,
  SectionLabel,
  ExportOption,
  CustomCheckbox,
  OptionIcon,
  OptionText,
  OptionDescription,
  ModalFooter,
  CancelButton,
  ActionButton
} from './styles';

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
      <ModalBackdrop onClick={onClose} />

      {/* Modal */}
      <ModalContainer>
        {/* Header */}
        <ModalHeader>
          <ModalHeaderContent>
            <ModalTitle>Export to Excel</ModalTitle>
            <ModalSubtitle>Choose what to include in the export</ModalSubtitle>
          </ModalHeaderContent>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {/* Sections */}
        <ModalBody>
          <SectionLabel>Select sheets to export</SectionLabel>

          {SECTIONS.map(section => {
            const isSelected = selected.has(section.id);
            const isDisabled = section.id === 'timeSeries' && !stats;

            return (
              <ExportOption
                key={section.id}
                $selected={isSelected}
                $disabled={isDisabled}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => !isDisabled && toggleSection(section.id)}
                  style={{ display: 'none' }}
                />
                {/* Custom checkbox */}
                <CustomCheckbox $selected={isSelected}>
                  {isSelected && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </CustomCheckbox>

                <OptionIcon>{section.icon}</OptionIcon>

                <div>
                  <OptionText>{section.label}</OptionText>
                  <OptionDescription>{section.description}</OptionDescription>
                </div>
              </ExportOption>
            );
          })}
        </ModalBody>

        {/* Footer */}
        <ModalFooter>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ActionButton
            onClick={handleExport}
            $done={done}
            $disabled={!selected.size || exporting || done}
            disabled={!selected.size || exporting || done}
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
          </ActionButton>
        </ModalFooter>
      </ModalContainer>
    </>
  );
};

export default ExportModal;

