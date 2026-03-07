import React, { useState } from 'react';
import { theme } from '@theme/theme';

interface ExportButtonProps {
  onExport: () => void;
  loading?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, loading }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onExport();
    setTimeout(() => setClicked(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: theme.borderRadius.md,
        border: `1.5px solid ${hovered ? theme.colors.teal : 'rgba(20,184,166,0.4)'}`,
        background: hovered
          ? 'rgba(20, 184, 166, 0.1)'
          : clicked
            ? 'rgba(20, 184, 166, 0.05)'
            : 'white',
        color: theme.colors.teal,
        fontWeight: 600,
        fontSize: '14px',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '0 4px 16px rgba(20,184,166,0.2)' : 'none',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {clicked ? (
        <>
          <span style={{ fontSize: '16px' }}>✅</span>
          <span>Exported!</span>
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'transform 0.2s', transform: hovered ? 'translateY(2px)' : 'translateY(0)' }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export to Excel</span>
        </>
      )}
    </button>
  );
};

export default ExportButton;
