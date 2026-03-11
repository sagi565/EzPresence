import { CSSProperties } from 'react';

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

  @media (max-width: 768px) {
    .content-drawer {
      transform: translateY(calc(100% - 48px)) !important;
    }
    .content-drawer.drawer-open {
      transform: translateY(0) !important;
    }
    .content-drawer-handle {
      padding: 8px !important;
    }
    .content-drawer-title {
      font-size: 12px !important;
    }
    .content-drawer-content {
      height: 240px !important;
    }
    .content-drawer-inner {
      padding: 8px 0px !important;
      flex-direction: column !important;
      gap: 12px !important;
    }
    .content-drawer-controls {
      padding: 0 12px !important;
    }
    .content-drawer-search {
      max-width: 100% !important;
    }
    .content-drawer-lists {
      width: 100% !important;
      border-left: none !important;
      border-top: 1px solid #f3f4f6 !important;
      flex-direction: row !important;
      max-height: 48px !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      flex-wrap: nowrap !important;
      -webkit-overflow-scrolling: touch !important;
      padding: 0 !important;
    }
    .content-drawer-list-pill {
      padding: 8px 12px !important;
      border-bottom: none !important;
      border-right: 1px solid #f3f4f6 !important;
      width: auto !important;
      white-space: nowrap !important;
      flex: 0 0 auto !important;
    }
    .content-drawer-list-pill-active {
      border-left: none !important;
      border-bottom: 3px solid #9b5de5 !important;
    }
    .content-drawer-list-pill-all-active {
      border-left: none !important;
      border-bottom: 4px solid #6d28d9 !important;
    }
    .content-card {
      width: 80px !important;
      height: 142px !important;
      padding: 4px !important;
    }
    .content-card-title {
      font-size: 9px !important;
      padding: 6px 4px 2px 4px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export const styles: Record<string, CSSProperties> = {
  drawer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: '24px 24px 0 0',
    boxShadow: '0 -4px 20px rgba(155, 93, 229, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    transform: 'translateY(calc(100% - 70px))',
  },
  drawerOpen: {
    transform: 'translateY(0)',
  },

  drawerHandle: {
    background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    borderBottom: '1px solid',
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: '24px 24px 0 0',
  },
  drawerArrow: {
    fontSize: '16px',
    color: '#6b7280',
    transition: 'all 0.3s',
  },
  drawerArrowOpen: {
    transform: 'rotate(180deg)',
    color: '#9b5de5',
  },
  drawerTitle: {
    fontWeight: 600,
    color: '#111827',
    fontSize: '14px',
  },

  drawerContent: {
    height: '340px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  drawerInner: {
    padding: '16px 24px',
    display: 'flex',
    gap: '0',
    height: '100%',
  },

  drawerControls: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: 0,
    paddingRight: '16px',
  },
  searchBar: {
    width: '100%',
    maxWidth: '300px',
    padding: '8px 14px',
    border: '2px solid',
    borderColor: '#faf5ff',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: '#f9fafb',
  },

  contentList: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '20px',
    alignItems: 'flex-start',
  },

  // SIDEBAR
  listsContainer: {
    width: '280px',
    flexShrink: 0,
    background: '#ffffff',
    borderLeft: '1px solid',
    borderLeftColor: ' #f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    overflowY: 'auto',
    maxHeight: '100%',
    paddingLeft: '0',
  },

  listPill: {
    padding: '12px 16px',
    border: 'none',
    borderColor: 'transparent',
    borderBottom: '1px solid #f3f4f6',
    background: 'transparent',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 500,
    color: '#374151',
    transition: 'all 0.2s',
    width: '100%',
    textAlign: 'left',
    borderRadius: '0',
  },
  listPillActive: {
    background: '#faf5ff',
    color: '#9b5de5',
    borderLeft: '3px solid',
    borderLeftColor: ' #9b5de5',
  },
  listPillAllActive: {
    background: 'linear-gradient(135deg, #fbcfe8 0%, #ddd6fe 100%)',
    color: '#6d28d9',
    borderLeft: '4px solid',
    borderLeftColor: '#6d28d9',
    fontWeight: 700,
  },
  listPillIcon: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },

  contentCard: {
    flexShrink: 0,
    width: '120px',
    height: '213px',
    background: '#ffffff',
    padding: '6px',
    cursor: 'pointer',
    position: 'relative',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid',
    borderColor: '#f3f4f6',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ✅ Yellow glow removed — now uses a subtle purple shadow
  contentCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(155, 93, 229, 0.25)',
  },
  contentThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    position: 'relative',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    inset: 0,
  },

  contentTitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
    color: 'white',
    fontSize: '11px',
    fontWeight: 700,
    padding: '12px 6px 4px 6px',
    textAlign: 'left',
    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
    zIndex: 2,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};