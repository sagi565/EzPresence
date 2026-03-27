import React from 'react';
import { theme } from '@/theme/theme';

/**
 * Small down arrow used in chip buttons to indicate dropdown behavior.
 */
interface ChipArrowProps {
    className?: string;
    style?: React.CSSProperties;
}

const ChipArrow: React.FC<ChipArrowProps> = ({ className, style }) => (
    <span 
        className={className}
        style={{
            fontSize: '10px',
            color: theme.colors.muted,
            marginLeft: '10px',
            flexShrink: 0,
            ...style
        }}
    >▼</span>
);

export default ChipArrow;
