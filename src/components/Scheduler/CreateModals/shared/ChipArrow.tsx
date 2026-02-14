import React from 'react';
import { theme } from '@/theme/theme';

/**
 * Small down arrow used in chip buttons to indicate dropdown behavior.
 */
const ChipArrow: React.FC = () => {
    return <span style={styles.chipArrow}>▾</span>;
};

const styles = {
    chipArrow: {
        fontSize: '10px',
        color: theme.colors.muted,
        marginLeft: '10px',
        flexShrink: 0,
    }
};

export default ChipArrow;
