import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '15px',
    fontWeight: 600,
    color: theme.colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  required: {
    color: '#ef4444',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    height: '52px',
    padding: '0 18px',
    border: '2px solid',
    borderColor: 'rgba(155, 93, 229, 0.2)',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: 'white',
    color: theme.colors.text,
    fontFamily: 'inherit',
  },
  inputHovered: {
    borderColor: 'rgba(155, 93, 229, 0.35)',
  },
  inputFocused: {
    borderColor: 'rgba(155, 93, 229, 0.35)',
  },
  inputError: {
    borderColor: '#ef4444',
    background: 'rgba(239, 68, 68, 0.03)',
  },
  errorText: {
    fontSize: '13px',
    color: '#ef4444',
    marginTop: '2px',
  },
};