import React, { ReactNode } from 'react';
import { theme } from '@/theme/theme';

interface ChipButtonProps {
    children: ReactNode;
    onClick?: () => void;
    minWidth?: string;
    maxWidth?: string;
    small?: boolean;
    style?: React.CSSProperties;
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

const styles = {
    chip: {
        padding: '7px 14px',
        border: '1.5px solid rgba(0, 0, 0, .1)',
        borderRadius: '8px',
        background: '#fff',
        fontSize: '14px',
        fontWeight: 500,
        color: theme.colors.text,
        cursor: 'pointer',
        transition: 'all .18s',
        display: 'inline-flex' as const,
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative' as const,
        userSelect: 'none' as const,
    },
    chipSmall: {
        padding: '5px 10px',
        fontSize: '12px',
        color: theme.colors.muted,
    }
};

// Hover style: apply via :hover in parent or use state
export const chipHoverStyle = {
    borderColor: theme.colors.primary,
    background: `${theme.colors.primary}08`,
};

export default ChipButton;
