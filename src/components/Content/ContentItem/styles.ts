import { CSSProperties } from 'react';

const stylesSheet = document.createElement("style");
stylesSheet.innerText = `
  @keyframes favoriteClick {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(stylesSheet);

export const styles: Record<string, CSSProperties> = {
  contentItem: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-radius 0.3s ease, box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    margin: '8px', // Ensure smooth layout flow
  },

  contentItemVideo: {
    width: '280px',
    height: '480px',
  },
  contentItemImage: {
    width: '280px',
    height: '480px',
  },

  contentItemHover: {
    transform: 'scale(1.03) translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },

  contentItemDragging: {
    opacity: 1,
    cursor: 'grabbing',
    // width: '56px', // Relied on scale
    // height: '96px', // Relied on scale
    borderRadius: '16px', // Keep original radius so it scales down smoothly
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    zIndex: 9999,
    backgroundColor: 'transparent',
    // transform: 'none', // Managed by manual positioning
    margin: 0, // Force zero margin to ensure perfect centering
    transition: 'none', // CRITICAL: Disable transition during drag to prevent lag
  },

  mediaContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  mediaCover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.3s ease',
  },

  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    zIndex: 2,
  },
  gradientOverlayVisible: {
    opacity: 1,
  },

  contentActions: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    display: 'flex',
    gap: '8px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 20,
  },
  contentActionsVisible: {
    opacity: 1,
  },

  actionBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1.5px solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'white',
    transition: 'all 0.2s ease',
    padding: 0,
  },

  actionBtnHover: {
    transform: 'scale(1.1)',
    background: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  actionBtnFavoriteActive: {
    background: 'rgba(239, 68, 68, 0.85)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
    opacity: 1,
    animation: 'favoriteClick 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
  },

  moreOptionsBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1.5px solid',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    opacity: 0,
    transition: 'opacity 0.3s ease, background 0.3s ease, transform 0.3s ease',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  moreOptionsBtnVisible: {
    opacity: 1,
  },
  moreOptionsBtnHover: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.1)',
  },

  menuDropdown: {
    position: 'absolute',
    top: '48px',
    right: '12px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    padding: '6px',
    zIndex: 100,
    minWidth: '140px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    animation: 'fadeIn 0.2s ease',
  },
  menuItem: {
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: 'none',
    borderColor: 'transparent',
    background: 'transparent',
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.2s',
  },
  menuItemHover: {
    background: 'rgba(155, 93, 229, 0.08)',
    color: '#9b5de5',
  },
  menuItemDeleteHover: {
    background: 'rgba(239, 68, 68, 0.08)',
    color: '#ef4444',
  },

  contentTitle: {
    position: 'absolute',
    bottom: '28px',
    left: '16px',
    right: '16px',
    color: 'white',
    fontWeight: 700,
    fontSize: '15px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 3,
    pointerEvents: 'none',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },
  contentDate: {
    position: 'absolute',
    bottom: '10px',
    left: '16px',
    right: '16px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '11px',
    fontWeight: 500,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 3,
    pointerEvents: 'none',
  },
  textVisible: {
    opacity: 1,
  },

  renameContainer: {
    position: 'absolute',
    bottom: '10px',
    left: '12px',
    right: '12px',
    zIndex: 25,
  },
  renameInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '2px solid',
    borderColor: '#9b5de5',
    background: 'white',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1f2937',
    outline: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },

  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    zIndex: 10,
  },
  spinner: {
    width: '28px',
    height: '28px',
    border: '3px solid',
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};