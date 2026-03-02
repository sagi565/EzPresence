import React from 'react';
import { theme } from '@/theme/theme';
import { CSSProperties } from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    checked,
    onChange,
    label,
    disabled = false,
}) => {
    const switchStyle: CSSProperties = {
        position: 'relative',
        width: '38px',
        height: '22px',
        background: checked ? theme.colors.primary : '#d1d5db',
        borderRadius: '11px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background .2s',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
    };

    const knobStyle: CSSProperties = {
        position: 'absolute',
        top: '2px',
        left: checked ? '18px' : '2px',
        width: '18px',
        height: '18px',
        background: '#fff',
        borderRadius: '50%',
        transition: 'transform .2s, left .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
    };

    const containerStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0',
    };

    const labelStyle: CSSProperties = {
        fontSize: '13px',
        fontWeight: 500,
        color: theme.colors.text,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    return (
        <div style={containerStyle}>
            {label && <span style={labelStyle}>{label}</span>}
            <div
                style={switchStyle}
                onClick={() => !disabled && onChange(!checked)}
            >
                <div style={knobStyle}></div>
            </div>
        </div>
    );
};

export default ToggleSwitch;
