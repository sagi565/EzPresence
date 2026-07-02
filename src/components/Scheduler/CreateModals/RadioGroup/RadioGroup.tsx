import React from 'react';
import { styles } from './styles';

interface RadioOption {
    label: string;
    value: string;
    tooltip?: string;
}

interface RadioGroupProps {
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    style?: React.CSSProperties;
    className?: string;
    renderTooltip?: (text: string) => React.ReactNode;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange, style, className, renderTooltip }) => {
    return (
        <div style={{ ...styles.radioGroup, ...style }} className={className}>
            {options.map((opt) => (
                <div
                    key={opt.value}
                    style={{
                        ...styles.radioPill,
                        ...(value === opt.value ? styles.radioPillActive : {}),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                    {opt.tooltip && renderTooltip && renderTooltip(opt.tooltip)}
                </div>
            ))}
        </div>
    );
};

export default RadioGroup;
