import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  controls: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center',
  },
  newChatBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid',
    borderColor: '#374151',
    borderRadius: '12px',
    color: '#374151',
    fontWeight: 400,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  newChatBtnHover: {
    transform: 'translateY(-2px)',
    background: 'rgba(55, 65, 81, 0.05)',
    borderColor: '#111827',
    color: '#111827',
  },
};