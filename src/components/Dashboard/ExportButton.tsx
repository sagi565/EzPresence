import React, { useState } from 'react';
import {
  StyledExportButton,
  ExportIcon,
  ExportButtonText
} from './styles';

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
    <StyledExportButton
      onClick={handleClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      $hovered={hovered}
      $clicked={clicked}
      $loading={loading}
    >
      {clicked ? (
        <>
          <span style={{ fontSize: '16px' }}>✅</span>
          <ExportButtonText>Exported!</ExportButtonText>
        </>
      ) : (
        <>
          <ExportIcon
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            $hovered={hovered}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </ExportIcon>
          <ExportButtonText>Export to Excel</ExportButtonText>
        </>
      )}
    </StyledExportButton>
  );
};

export default ExportButton;


