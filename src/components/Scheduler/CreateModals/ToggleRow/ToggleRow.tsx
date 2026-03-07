import React, { useState } from 'react';
import { styles } from './styles';

interface ToggleRowProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    style?: React.CSSProperties;
    tooltip?: string;
}

const tooltipBubbleStyle: React.CSSProperties = {
    display: 'block',
    position: 'absolute',
    bottom: 'calc(100% + 6px)',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#111827',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 400,
    lineHeight: 1.4,
    padding: '8px 12px',
    borderRadius: '8px',
    whiteSpace: 'pre-line',
    width: '220px',
    zIndex: 1800,
    boxShadow: '0 4px 16px rgba(0,0,0,.25)',
    pointerEvents: 'none',
};

const tooltipArrowStyle: React.CSSProperties = {
    content: '',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '5px solid transparent',
    borderTopColor: '#111827',
    width: 0,
    height: 0,
};

const ToggleRow: React.FC<ToggleRowProps> = ({ label, checked, onChange, style, tooltip }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div style={{ ...styles.toggleRow, ...style }}>
            <div style={styles.toggleLabel}>
                {label}
                {tooltip && (
                    <div
                        style={{ ...styles.tooltipIcon, position: 'relative' }}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        i
                        {showTooltip && (
                            <span style={tooltipBubbleStyle}>
                                {tooltip}
                                <span style={tooltipArrowStyle} />
                            </span>
                        )}
                    </div>
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
