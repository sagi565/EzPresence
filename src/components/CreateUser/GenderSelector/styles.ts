import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

// Purple SVG arrow for dropdowns
const arrowSvg = `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239B5DE5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

export const styles: Record<string, CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '15px',
    fontWeight: 600,
    color: theme.colors.text,
  },
  selectBox: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '52px',
    padding: '0 44px 0 16px',
    border: '2px solid',
    borderColor: 'rgba(155, 93, 229, 0.2)',
    borderRadius: '12px',
    fontSize: '15px',
    background: 'white',
    color: theme.colors.text,
    fontFamily: 'inherit',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundImage: arrowSvg,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
  },
  selectBoxFocused: {
    borderColor: 'rgba(155, 93, 229, 0.35)',
  },
  selectedText: {
    color: theme.colors.text,
  },
  placeholder: {
    color: theme.colors.muted,
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
    padding: '6px 0',
  },
  option: {
    padding: '12px 16px',
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
};