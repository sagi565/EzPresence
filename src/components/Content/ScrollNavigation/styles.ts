import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  scrollNav: {
    position: 'fixed',
    right: '20px',
    top: '68px',
    bottom: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '0',
    zIndex: 100,
    padding: '24px 60px 24px 24px',
    pointerEvents: 'none',
  },

  dotsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0',
    overflow: 'visible',
    padding: '0 28px 0 0',
    pointerEvents: 'auto',
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
    padding: '32px 0',
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

  // Base dot style - neutral
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
    zIndex: 2,
  },

  // System list default state - yellow/orange tint
  scrollDotSystem: {
    background: 'rgba(251, 191, 36, 0.1)',
    border: '2px solid rgba(251, 191, 36, 0.3)',
  },

  // Custom list default state - purple tint
  scrollDotCustom: {
    background: 'rgba(155, 93, 229, 0.1)',
    border: '2px solid rgba(155, 93, 229, 0.3)',
  },

  // Made by Creators default state - purple-to-indigo gradient
  scrollDotCreators: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
    border: '2px solid rgba(168, 85, 247, 0.4)',
  },

  // Hover state - slightly bigger
  scrollDotHover: {
    transform: 'scale(1.15)',
  },

  // Hover for system lists - brighter yellow/orange
  scrollDotHoverSystem: {
    background: 'rgba(251, 191, 36, 0.2)',
    border: '2px solid rgba(251, 191, 36, 0.5)',
    transform: 'scale(1.15)',
  },

  // Hover for custom lists - brighter purple
  scrollDotHoverCustom: {
    background: 'rgba(155, 93, 229, 0.2)',
    border: '2px solid rgba(155, 93, 229, 0.5)',
    transform: 'scale(1.15)',
  },

  // Hover for Made by Creators - brighter gradient
  scrollDotHoverCreators: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.28) 0%, rgba(168, 85, 247, 0.28) 100%)',
    border: '2px solid rgba(168, 85, 247, 0.65)',
    transform: 'scale(1.15)',
  },

  // Selected/Active state - System (yellow)
  scrollDotActiveSystem: {
    background: 'rgba(251, 191, 36, 0.25)',
    border: '2px solid rgba(251, 191, 36, 0.75)',
    boxShadow: '0 0 18px rgba(251, 191, 36, 0.45)',
    transform: 'scale(1.18)',
  },

  // Selected/Active state - Custom (purple)
  scrollDotActiveCustom: {
    background: 'rgba(155, 93, 229, 0.25)',
    border: '2px solid rgba(155, 93, 229, 0.75)',
    boxShadow: '0 0 18px rgba(155, 93, 229, 0.45)',
    transform: 'scale(1.18)',
  },

  // Selected/Active state - Made by Creators (gradient glow)
  scrollDotActiveCreators: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.35) 100%)',
    border: '2px solid rgba(168, 85, 247, 0.85)',
    boxShadow: '0 0 18px rgba(168, 85, 247, 0.5), 0 0 8px rgba(99, 102, 241, 0.3)',
    transform: 'scale(1.18)',
  },

  // When content item is being dragged - make icons semi-transparent
  scrollDotItemDragging: {
    opacity: 0.6,
  },

  // Disabled state for invalid drop targets
  scrollDotDisabled: {
    opacity: 0.3,
    filter: 'grayscale(1)',
    cursor: 'not-allowed',
  },

  // Drop target when hovering with content item (Base)
  scrollDotDropTarget: {
    width: '52px',
    height: '52px',
    opacity: 1,
  },

  // Drop target for system lists (yellow)
  scrollDotDropTargetSystem: {
    background: 'rgba(251, 191, 36, 0.3)',
    border: '2px solid rgba(251, 191, 36, 0.7)',
    boxShadow: '0 0 24px rgba(251, 191, 36, 0.5)',
  },

  // Drop target for custom lists (purple)
  scrollDotDropTargetCustom: {
    background: 'linear-gradient(135deg, rgba(155, 93, 229, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
    border: '2px solid rgba(155, 93, 229, 0.7)',
    boxShadow: '0 0 24px rgba(155, 93, 229, 0.5)',
  },

  // Celebration animation after successful drop
  scrollDotCelebrating: {
    animation: 'celebrate 0.6s ease-out',
  },

  scrollIcon: {
    fontSize: '18px',
    transition: 'transform 0.2s ease',
    pointerEvents: 'none',
  },

  scrollLine: {
    position: 'absolute',
    right: '21px',
    top: '76px', // Position at the bottom of the dot (32px padding + 44px dot height)
    width: '2px',
    height: '64px',
    background: 'rgba(0, 0, 0, 0.08)',
    borderRadius: '1px',
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'top',
  },

  scrollLineHidden: {
    height: '0px',
    opacity: 0,
  },

  scrollArrow: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '4px 0',
    cursor: 'pointer',
    color: '#9ca3af',
    transition: 'all 0.2s ease',
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    alignSelf: 'flex-end',
    marginRight: '28px',
    pointerEvents: 'auto',
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

// CSS Keyframes for celebration animation - inject into document
const celebrationKeyframes = `
@keyframes celebrate {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(155, 93, 229, 0.7);
  }
  30% {
    transform: scale(1.3);
    box-shadow: 0 0 20px 10px rgba(155, 93, 229, 0.4);
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(1.2);
    box-shadow: 0 0 30px 15px rgba(155, 93, 229, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(155, 93, 229, 0);
  }
}
`;

// Inject keyframes into document head
if (typeof document !== 'undefined') {
  const styleId = 'scroll-navigation-animations';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = celebrationKeyframes;
    document.head.appendChild(styleSheet);
  }
}