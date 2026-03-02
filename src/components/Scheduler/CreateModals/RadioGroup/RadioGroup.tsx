import React from 'react';
import { styles } from './styles';

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
        <div style={{ ...styles.radioGroup, ...style }} className={className}>
            {options.map((opt) => (
                <div
                    key={opt.value}
                    style={{
                        ...styles.radioPill,
                        ...(value === opt.value ? styles.radioPillActive : {})
                    }}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                </div>
            ))}
        </div>
    );
};

export default RadioGroup;
