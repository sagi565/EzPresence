import React from 'react';
import { StyledChipArrow } from './styles';

/**
 * Small down arrow used in chip buttons to indicate dropdown behavior.
 */
interface ChipArrowProps {
}

const ChipArrow: React.FC<ChipArrowProps> = () => (
    <StyledChipArrow>▼</StyledChipArrow>
);

export default ChipArrow;
