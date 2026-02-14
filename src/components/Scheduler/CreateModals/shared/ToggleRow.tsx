import React from 'react';
import { theme } from '@/theme/theme';

interface ToggleRowProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    style?: React.CSSProperties;
    tooltip?: string;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, checked, onChange, style, tooltip }) => {
    return (
        <div style={{ ...styles.toggleRow, ...style }}>
            <div style={styles.toggleLabel}>
                {label}
                {tooltip && (
                    <div style={styles.tooltipIcon} title={tooltip}>?</div>
                )}
            </div>
            <div
                style={{
                    ...styles.toggleSwitch,
                    ...(checked ? styles.toggleSwitchOn : {})
                }}
                onClick={() => onChange(!checked)}
            >
                <div
                    style={{
                        ...styles.toggleThumb,
                        transform: checked ? 'translateX(16px)' : 'translateX(2px)'
                    }}
                />
            </div>
        </div>
    );
};

const styles = {
    toggleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0',
    },
    toggleLabel: {
        fontSize: '13px',
        fontWeight: 500,
        color: theme.colors.text,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    toggleSwitch: {
        position: 'relative' as const,
        width: '38px',
        height: '22px',
        background: '#d1d5db',
        borderRadius: '11px',
        cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0,
    },
    toggleSwitchOn: {
        background: theme.colors.primary,
    },
    toggleThumb: {
        position: 'absolute' as const,
        top: '2px',
        left: '2px',
        width: '18px',
        height: '18px',
        background: '#fff',
        borderRadius: '50%',
        transition: 'transform .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
    },
    tooltipIcon: {
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        background: 'rgba(155, 93, 229, .1)',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.primary,
        cursor: 'help',
    }
};

export default ToggleRow;
