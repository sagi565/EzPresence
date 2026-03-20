import React, { useState } from 'react';
import * as S from './styles';

interface ToggleRowProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    style?: React.CSSProperties;
    tooltip?: string;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, checked, onChange, style, tooltip }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <S.Container style={style}>
            <S.Label>
                {label}
                {tooltip && (
                    <S.TooltipWrapper
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <S.TooltipIcon>i</S.TooltipIcon>
                        {showTooltip && (
                            <S.TooltipBubble>
                                {tooltip}
                            </S.TooltipBubble>
                        )}
                    </S.TooltipWrapper>
                )}
            </S.Label>
            <S.ToggleSwitch
                $on={checked}
                onClick={() => onChange(!checked)}
            >
                <S.ToggleThumb $on={checked} />
            </S.ToggleSwitch>
        </S.Container>
    );
};

export default ToggleRow;
