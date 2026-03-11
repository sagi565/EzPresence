import React, { ReactNode } from 'react';
import { styles } from './styles';

export { chipHoverStyle } from './styles';

interface ChipButtonProps {
    children: ReactNode;
    onClick?: () => void;
    minWidth?: string;
    maxWidth?: string;
    small?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

/**
 * Shared chip button component matching the demo's nsm-chip styling.
 * Used for Date, Time, Timezone, and Repeat selectors.
 */
const ChipButton: React.FC<ChipButtonProps> = ({
    children,
    onClick,
    minWidth,
    maxWidth,
    small = false,
    style = {}
}) => {
    return (
        <div
            className={`chip-button ${small ? 'chip-button-small' : ''}`}
            style={{
                ...styles.chip,
                ...(small ? styles.chipSmall : {}),
                ...(minWidth ? { minWidth } : {}),
                ...(maxWidth ? { maxWidth } : {}),
                ...style
            }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default ChipButton;
