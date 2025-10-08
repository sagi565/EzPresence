import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  row: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 },
  socialBtn: {
    height: 44,
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.08)',
    background: theme.colors.surface,
    cursor: 'pointer',
  },
};
