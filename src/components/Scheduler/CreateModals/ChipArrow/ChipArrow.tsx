import React from 'react';
import { theme } from '@/theme/theme';

/**
 * Small down arrow used in chip buttons to indicate dropdown behavior.
 */
interface ChipArrowProps {
}

const ChipArrow: React.FC<ChipArrowProps> = () => (
    <span style={{
        fontSize: '10px',
        color: theme.colors.muted,
        marginLeft: '10px',
        flexShrink: 0,
    }}>▼</span>
);

export default ChipArrow;
