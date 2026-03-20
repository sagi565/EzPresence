import React from 'react';
import * as S from './styles';

interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupProps {
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    style?: React.CSSProperties;
    className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange, style, className }) => {
    return (
        <S.Container style={style} className={className}>
            {options.map((opt) => (
                <S.RadioPill
                    key={opt.value}
                    $isActive={value === opt.value}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                </S.RadioPill>
            ))}
        </S.Container>
    );
};

export default RadioGroup;
