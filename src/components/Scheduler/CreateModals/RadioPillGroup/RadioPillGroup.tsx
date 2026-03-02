import React from 'react';
import { theme } from '@/theme/theme';
import { CSSProperties } from 'react';

interface RadioOption {
    value: string;
    label: string;
}

interface RadioPillGroupProps {
    options: RadioOption[];
    selected: string;
    onChange: (value: string) => void;
    name: string;
}

const RadioPillGroup: React.FC<RadioPillGroupProps> = ({
    options,
    selected,
    onChange,
    name,
}) => {
    const containerStyle: CSSProperties = {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap' as const,
    };

    const pillStyle = (isActive: boolean): CSSProperties => ({
        padding: '6px 14px',
        border: `1.5px solid ${isActive ? theme.colors.primary : 'rgba(0, 0, 0, .1)'}`,
        borderRadius: '20px',
        background: isActive ? 'rgba(155, 93, 229, .1)' : '#fff',
        fontSize: '12px',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? theme.colors.primary : theme.colors.muted,
        cursor: 'pointer',
        transition: 'all .18s',
    });

    return (
        <div style={containerStyle}>
            {options.map((option) => {
                const isActive = selected === option.value;
                return (
                    <button
                        key={option.value}
                        style={pillStyle(isActive)}
                        onClick={() => onChange(option.value)}
                        type="button"
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

export default RadioPillGroup;
