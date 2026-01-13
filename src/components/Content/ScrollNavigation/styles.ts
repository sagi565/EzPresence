import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  scrollNav: {
    position: 'fixed',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0',
    zIndex: 100,
    padding: '8px',
  },

  dotsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0',
    overflow: 'hidden',
    padding: '8px 0',
  },

  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    transition: 'transform 0.3s ease',
  },

  scrollItem: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '16px 0',
    gap: '12px',
    minWidth: '200px',
  },

  scrollItemDragging: {
    cursor: 'grabbing',
  },

  // Label on the LEFT of the icon
  scrollLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#374151',
    whiteSpace: 'nowrap',
    opacity: 0,
    transform: 'translateX(8px)',
    transition: 'all 0.2s ease',
    pointerEvents: 'none',
    paddingRight: '4px',
  },

  scrollLabelVisible: {
    opacity: 1,
    transform: 'translateX(0)',
  },

  scrollDot: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.04)',
    border: '2px solid transparent',
    transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
    cursor: 'grab',
  },

  scrollDotHover: {
    background: 'rgba(155, 93, 229, 0.1)',
    border: '2px solid rgba(155, 93, 229, 0.3)',
    transform: 'scale(1.08)',
  },

  scrollDotActiveSystem: {
    background: 'rgba(251, 191, 36, 0.15)',
    border: '2px solid rgba(251, 191, 36, 0.5)',
    boxShadow: '0 0 16px rgba(251, 191, 36, 0.25)',
  },

  scrollDotActiveCustom: {
    background: 'rgba(20, 184, 166, 0.15)',
    border: '2px solid rgba(20, 184, 166, 0.5)',
    boxShadow: '0 0 16px rgba(20, 184, 166, 0.25)',
  },

  scrollDotDropTarget: {
    width: '52px',
    height: '52px',
    background: 'linear-gradient(135deg, rgba(155, 93, 229, 0.25) 0%, rgba(241, 91, 181, 0.25) 100%)',
    border: '2px solid rgba(155, 93, 229, 0.7)',
    boxShadow: '0 0 24px rgba(155, 93, 229, 0.4)',
  },

  scrollIcon: {
    fontSize: '18px',
    transition: 'transform 0.2s ease',
    pointerEvents: 'none',
  },

  scrollLine: {
    position: 'absolute',
    right: '21px',
    bottom: '-16px',
    width: '2px',
    height: '32px',
    background: 'rgba(0, 0, 0, 0.08)',
    borderRadius: '1px',
    transition: 'opacity 0.2s ease',
  },

  scrollLineHidden: {
    opacity: 0,
  },

  scrollArrow: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#9ca3af',
    transition: 'all 0.2s ease',
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    margin: '4px 0',
    alignSelf: 'flex-end',
    marginRight: '4px',
  },

  scrollArrowDisabled: {
    opacity: 0.3,
    cursor: 'default',
    pointerEvents: 'none',
  },

  scrollArrowHover: {
    background: 'rgba(155, 93, 229, 0.1)',
    color: '#9b5de5',
  },

  contextMenu: {
    position: 'fixed',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    padding: '6px',
    zIndex: 2000,
    minWidth: '140px',
  },

  contextMenuItem: {
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  },

  contextMenuItemHover: {
    background: 'rgba(239, 68, 68, 0.1)',
  },
};