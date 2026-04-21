import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import TrashButton from '@components/Scheduler/CreateModals/TrashButton/TrashButton';

interface PostContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
}

const PostContextMenu: React.FC<PostContextMenuProps> = ({ x, y, onDelete, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleMouseDown = () => onClose();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  const menuWidth = 160;
  const menuHeight = 56;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 8);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 8);

  return createPortal(
    <>
      <div
        style={{
          position: 'fixed',
          top: adjustedY,
          left: adjustedX,
          zIndex: 9000,
          background: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)',
          minWidth: menuWidth,
          padding: '6px',
          animation: 'postCtxAppear 0.12s cubic-bezier(0.16,1,0.3,1)',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Only call onDelete — do NOT also call onClose here.
            Calling both in the same React event batch clears contextMenuPost
            before executePostDelete can read it, causing an early-return. */}
        <TrashButton
          onClick={() => onDelete()}
          title="Delete"
          style={{ width: '100%', borderRadius: '8px', height: '40px', justifyContent: 'flex-start', paddingLeft: '12px' }}
        >
          Delete
        </TrashButton>
      </div>
      <style>{`
        @keyframes postCtxAppear {
          from { opacity: 0; transform: scale(0.92) translateY(-4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </>,
    document.body
  );
};

export default PostContextMenu;
