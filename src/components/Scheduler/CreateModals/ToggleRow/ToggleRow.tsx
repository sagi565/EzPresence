import React from 'react';
import { styles } from './styles';

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

export default ToggleRow;
