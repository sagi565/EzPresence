import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

// Purple SVG arrow for dropdowns
const arrowSvg = `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239B5DE5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

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
  selectGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
  },
  dropdownContainer: {
    position: 'relative',
  },
  select: {
    display: 'flex',
    alignItems: 'center',
    height: '52px',
    padding: '0 40px 0 16px',
    border: '2px solid',
    borderColor: 'rgba(155, 93, 229, 0.2)',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: 'white',
    color: theme.colors.text,
    fontFamily: 'inherit',
    cursor: 'pointer',
    backgroundImage: arrowSvg,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    width: '100%',
  },
  selectFocused: {
    borderColor: 'rgba(155, 93, 229, 0.35)',
  },
  selectError: {
    borderColor: '#ef4444',
    background: 'rgba(239, 68, 68, 0.03)',
  },
  selectedText: {
    color: theme.colors.text,
  },
  placeholderText: {
    color: theme.colors.muted,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    background: 'transparent',
    color: theme.colors.text,
    fontFamily: 'inherit',
    width: '100%',
    padding: 0,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    background: 'white',
    border: '2px solid',
    borderColor: 'rgba(155, 93, 229, 0.15)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropdownList: {
    maxHeight: '240px',
    overflowY: 'auto',
    padding: '6px 0',
  },
  option: {
    padding: '10px 16px',
    fontSize: '15px',
    color: theme.colors.text,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  optionHighlighted: {
    background: 'rgba(155, 93, 229, 0.08)',
  },
  optionSelected: {
    background: 'rgba(155, 93, 229, 0.12)',
  },
  noResults: {
    padding: '12px 16px',
    fontSize: '14px',
    color: theme.colors.muted,
    textAlign: 'center',
  },
  errorText: {
    fontSize: '13px',
    color: '#ef4444',
    marginTop: '2px',
  },
};