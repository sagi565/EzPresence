import React, { ReactNode } from 'react';
import { StyledChip } from './styles';

export { chipHoverStyle } from './styles';

interface ChipButtonProps {
    children: ReactNode;
    onClick?: () => void;
    minWidth?: string;
    maxWidth?: string;
    small?: boolean;
    style?: React.CSSProperties; // Keep for external overrides if any
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
    style = {},
    className
}) => {
    return (
        <StyledChip
            className={className}
            $small={small}
            $minWidth={minWidth}
            $maxWidth={maxWidth}
            style={style}
            onClick={onClick}
        >
            {children}
        </StyledChip>
    );
};

export default ChipButton;
