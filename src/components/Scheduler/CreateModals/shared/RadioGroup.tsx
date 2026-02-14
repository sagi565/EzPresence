import React from 'react';
import { theme } from '@/theme/theme';

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

const styles = {
    radioGroup: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap' as const,
    },
    radioPill: {
        padding: '6px 14px',
        border: '1.5px solid rgba(0, 0, 0, .1)',
        borderRadius: '20px',
        background: '#fff',
        fontSize: '12px',
        fontWeight: 500,
        color: theme.colors.muted,
        cursor: 'pointer',
        transition: 'all .18s',
    },
    radioPillActive: {
        borderColor: theme.colors.primary,
        background: 'rgba(155, 93, 229, .1)',
        color: theme.colors.primary,
        fontWeight: 600,
    }
};

export default RadioGroup;
