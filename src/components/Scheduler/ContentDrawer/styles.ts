import { CSSProperties } from 'react';

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
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
    zIndex: 900,
    display: 'flex',
    flexDirection: 'column',
    transform: 'translateY(calc(100% - 48px))', 
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
    borderBottom: '1px solid rgba(0,0,0,0.05)',
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
    height: '240px', 
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  drawerInner: {
    padding: '16px 24px',
    display: 'flex',
    gap: '0', // NO GAP
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
    border: '2px solid #faf5ff',
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
    width: '280px', // Wider
    flexShrink: 0,
    background: '#ffffff',
    borderLeft: '1px solid #f3f4f6',
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
    borderLeft: '3px solid #9b5de5', 
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
    width: '152px',
    height: '92px',
    background: '#ffffff',
    padding: '6px',
    cursor: 'pointer',
    position: 'relative',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #f3f4f6',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(251, 191, 36, 0.3)',
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