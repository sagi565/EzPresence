import { useCallback } from 'react';
import type { DashboardStats } from './useDashboardStats';
import type { DashboardPost } from './useDashboardPosts';

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

function downloadCsv(filename: string, csvContent: string): void {
  const BOM = '\uFEFF'; // UTF-8 BOM so Excel reads it correctly
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const useDashboardExport = () => {
  const exportStats = useCallback(
    (stats: DashboardStats | null, platform: string, timeRange: string) => {
      if (!stats) return;
      const headers = ['Date', 'Views', 'Likes', 'Shares', 'Posts', 'Comments'];
      const rows = stats.timeSeries.map(d => [
        d.date,
        d.views,
        d.likes,
        d.shares,
        d.posts,
        d.comments,
      ]);
      const csv = toCsv(headers, rows);
      const filename = `dashboard_stats_${platform}_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCsv(filename, csv);
    },
    [],
  );

  const exportPosts = useCallback((posts: DashboardPost[]) => {
    const headers = [
      'ID', 'Platform', 'Type', 'Caption', 'Published At',
      'Views', 'Likes', 'Shares', 'Comments',
    ];
    const rows = posts.map(p => [
      p.id,
      p.platform,
      p.type,
      p.caption,
      new Date(p.publishedAt).toLocaleString(),
      p.stats.views,
      p.stats.likes,
      p.stats.shares,
      p.stats.comments,
    ]);
    const csv = toCsv(headers, rows);
    const filename = `dashboard_posts_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCsv(filename, csv);
  }, []);

  const exportAll = useCallback(
    (
      stats: DashboardStats | null,
      posts: DashboardPost[],
      platform: string,
      timeRange: string,
    ) => {
      // Export two sheets as separate downloads
      exportStats(stats, platform, timeRange);
      setTimeout(() => exportPosts(posts), 300);
    },
    [exportStats, exportPosts],
  );

  return { exportStats, exportPosts, exportAll };
};
