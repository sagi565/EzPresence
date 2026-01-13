import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  modelSelector: {
    position: 'relative',
    display: 'inline-block',
  },
  modelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 18px',
    border: '2px solid',
    borderColor: 'rgba(155, 93, 229, 0.2)',
    borderRadius: '12px',
    fontWeight: 550,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '140px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    color: theme.colors.text,
    background: 'transparent',
  },
  modelButtonVeo3: {
    background: 'linear-gradient(135deg, rgba(155, 93, 229, 0.1) 0%, rgba(251, 191, 36, 0.1) 30%, rgba(245, 158, 11, 0.1) 70%, rgba(217, 119, 6, 0.1) 100%)',
  },
  modelButtonVeo2: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
  },
  modelButtonOpen: {
    transform: 'translateY(-2px)',
  },
  modelButtonVeo3Hover: {
    boxShadow: '0 6px 25px rgba(251, 191, 36, 0.5), 0 0 20px rgba(155, 93, 229, 0.4)',
    transform: 'translateY(-2px)',
  },
  modelButtonVeo2Hover: {
    boxShadow: '0 6px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(236, 72, 153, 0.3)',
    transform: 'translateY(-2px)',
  },
  arrow: {
    marginLeft: 'auto',
    transition: 'transform 0.3s ease',
  },
  arrowOpen: {
    transform: 'rotate(180deg)',
  },
  modelDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    width: '360px',
    background: 'rgba(255, 255, 255, 0.98)',
    border: '2px solid',
    borderColor: theme.colors.primary,
    borderRadius: '12px',
    padding: '8px',
    boxShadow: '0 15px 35px rgba(155, 93, 229, 0.2)',
    opacity: 0,
    transform: 'scale(0.95) translateY(-10px)',
    pointerEvents: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 100,
  },
  modelDropdownOpen: {
    opacity: 1,
    transform: 'scale(1) translateY(0)',
    pointerEvents: 'auto',
  },
  modelOption: {
    padding: '12px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '6px',
    border: '2px solid',
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  modelOptionVeo3: {
    background: 'linear-gradient(135deg, rgba(155, 93, 229, 0.1) 0%, rgba(251, 191, 36, 0.1) 30%, rgba(245, 158, 11, 0.1) 70%, rgba(217, 119, 6, 0.1) 100%)',
    color: theme.colors.text,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  modelOptionVeo2: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
    color: theme.colors.text,
  },
  modelOptionVeo3Hover: {
    background: 'linear-gradient(135deg, rgba(155, 93, 229, 0.25) 0%, rgba(251, 191, 36, 0.25) 30%, rgba(245, 158, 11, 0.25) 70%, rgba(217, 119, 6, 0.25) 100%)',
  },
  modelOptionVeo2Hover: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.13) 0%, rgba(147, 51, 234, 0.13) 50%, rgba(236, 72, 153, 0.13) 100%)',
  },
  modelOptionSelectedVeo3: {
    background: 'linear-gradient(135deg, rgba(155, 93, 229, 0.2) 0%, rgba(251, 191, 36, 0.2) 30%, rgba(245, 158, 11, 0.2) 70%, rgba(217, 119, 6, 0.2) 100%)',
    borderColor: '#fbbf24',
  },
  modelOptionSelectedVeo2: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 50%, rgba(236, 72, 153, 0.2) 100%)',
    borderColor: '#9333ea',
  },
  modelOptionTitle: {
    fontWeight: 700,
    marginBottom: '4px',
    fontSize: '15px',
  },
  modelOptionDesc: {
    fontSize: '13px',
    color: theme.colors.muted,
    lineHeight: 1.4,
  },
};