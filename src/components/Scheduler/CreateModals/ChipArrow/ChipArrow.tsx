import React from 'react';
import { styles } from './styles';

/**
 * Small down arrow used in chip buttons to indicate dropdown behavior.
 */
const ChipArrow: React.FC = () => {
    return <span style={styles.chipArrow}>▾</span>;
};

export default ChipArrow;
