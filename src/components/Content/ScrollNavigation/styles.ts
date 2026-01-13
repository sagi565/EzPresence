import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  scrollNav: {
    position: 'fixed',
    right: '40px', // More centered from edge
    top: '50%', // Perfect center
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto', // Let content determine width
    gap: '0',
    zIndex: 1000,
    height: 'auto',
  },
  // ... (keeping dotsContainer as is or checking if it needs update? dotsContainer has alignItems: flex-end. If scrollNav is center, dotsContainer is centered in scrollNav. That's fine.)

  scrollIcon: {
    position: 'absolute',
    fontSize: '18px',
    opacity: 1,
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    transform: 'scale(1)',
    pointerEvents: 'none',
    color: '#333',
    zIndex: 2000,
    visibility: 'visible',
  },
  dotsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'auto', // Match scrollNav width
    paddingRight: '0',
    gap: '0',
    overflow: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    transition: 'transform 0.3s ease-out',
  },
  scrollItem: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '0',
    // transition: 'transform 0.3s ease, opacity 0.3s ease', // Disabled for performance/drag
  },
  scrollItemDragging: {
    zIndex: 1000,
    transform: 'scale(1.05)', // Reset to normal size (visible)
    transformOrigin: 'center center',
    opacity: 1, // Ensure visibility
    transition: 'none',
  },
  scrollDotContainer: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    background: '#fff',
    borderRadius: '50%',
    margin: '0',
    transition: 'transform 0.3s ease',

  },
  scrollDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: 'rgba(155, 93, 229, 0.15)',
    border: '2px solid',
    borderColor: 'rgba(155, 93, 229, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scrollDotDraggable: {
    cursor: 'grab',
  },
  scrollDotBeingDragged: {
    opacity: 1, // Ensure fully visible
    transform: 'scale(1.05)',
  },
  scrollDotHover: {
    width: '36px',
    height: '36px',
    background: 'rgba(155, 93, 229, 0.1)',
    borderColor: 'rgba(155, 93, 229, 0.5)',
  },
  scrollDotActiveSystem: {
    width: '36px',
    height: '36px',
    background: theme.colors.secondary,
    borderColor: theme.colors.secondary,
    boxShadow: '0 0 24px rgba(251, 191, 36, 0.4)',
  },
  scrollDotActiveCustom: {
    width: '36px',
    height: '36px',
    background: theme.colors.teal,
    borderColor: theme.colors.teal,
    boxShadow: '0 0 24px rgba(20, 184, 166, 0.4)',
  },
  scrollDotDragOver: {
    width: '44px',
    height: '44px',
    background: 'rgba(155, 93, 229, 0.3)',
    borderColor: theme.colors.primary,
    boxShadow: '0 0 30px rgba(155, 93, 229, 0.6)',
  },
  scrollDotDisabled: {
    background: 'rgba(155, 93, 229, 0.05)',
    borderColor: 'rgba(155, 93, 229, 0.15)',
    opacity: 0.4,
    cursor: 'not-allowed',
    filter: 'grayscale(0.7)',
  },
  scrollLine: {
    width: '2px',
    height: '60px', // Gap size
    background: 'rgba(155, 93, 229, 0.15)', // Lighter color
    margin: '10px 0', // Add margin
    position: 'relative',
    zIndex: 1,
    transition: 'background 0.3s ease, opacity 0.2s ease',
  },
  scrollLineHidden: {
    opacity: 0,
  },
  scrollIconVisible: {
    opacity: 1,
    transform: 'scale(1)',
  },

  scrollLabel: {
    position: 'absolute',
    right: '60px', // Fixed distance to ensure perfect alignment
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '13px',
    fontWeight: 600,
    color: theme.colors.text,
    background: 'rgba(255, 255, 255, 0.98)',
    padding: '8px 14px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    whiteSpace: 'nowrap',
    zIndex: 100000,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none', // Ensure it doesn't block mouse
  },
  paginationArrow: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(155, 93, 229, 0.1)',
    border: '2px solid',
    borderColor: 'rgba(155, 93, 229, 0.3)',
    color: theme.colors.primary,
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
    flexShrink: 0,
  },
  paginationArrowUp: {
    marginBottom: '12px',
  },
  paginationArrowDown: {
    marginTop: '12px',
  },
  paginationArrowHover: {
    background: 'rgba(155, 93, 229, 0.25)',
    borderColor: theme.colors.primary,
    transform: 'scale(1.15)',
    boxShadow: '0 4px 12px rgba(155, 93, 229, 0.3)',
  },
  paginationArrowHidden: {
    opacity: 0,
    pointerEvents: 'none',
    transform: 'scale(0.8)',
  },
  contextMenu: {
    position: 'fixed',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    padding: '8px',
    zIndex: 2000,
    minWidth: '140px',
    animation: 'fadeIn 0.15s ease',
  },
  contextMenuItem: {
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  scrollDotDropTarget: {
    animation: 'celebration 0.6s cubic-bezier(0.25, 1, 0.5, 1) infinite alternate',
    boxShadow: '0 0 30px rgba(155, 93, 229, 0.8), 0 0 10px rgba(255, 255, 255, 0.5)',
    zIndex: 10,
    transform: 'scale(1.2)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#fff',
  },
  scrollArrow: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#1f2937',
    fontSize: '18px',
    transition: 'all 0.2s',
    borderRadius: '50%',
    background: 'white',
    // border: '1px solid rgba(0,0,0,0.1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.1)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    margin: '4px 0',
    zIndex: 10,
    flexShrink: 0,
  },
  scrollArrowDisabled: {
    opacity: 0, // Completely invisible
    cursor: 'default',
    pointerEvents: 'none',
    background: '#f3f4f6',
    boxShadow: 'none',
    border: '1px solid',
    borderColor: 'transparent',
  },
  scrollArrowHover: {
    transform: 'translateY(-2px) scale(1.1)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
    color: '#9b5de5',
    borderColor: '#9b5de5',
  },
};

// Add global keyframes for celebration
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes celebration {
    0% { transform: scale(1.1); box-shadow: 0 0 15px rgba(155, 93, 229, 0.4); }
    100% { transform: scale(1.35); box-shadow: 0 0 30px rgba(155, 93, 229, 0.8); }
  }
`;
document.head.appendChild(styleSheet);