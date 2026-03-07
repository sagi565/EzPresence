import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles';

interface RecurringActionDialogProps {
    isOpen: boolean;
    onConfirm: (option: 'this' | 'following' | 'all') => void;
    onCancel: () => void;
    mode: 'edit' | 'delete';
}

const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a1a2e',
    color: '#fff',
    padding: '7px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 400,
    zIndex: 9999,
    lineHeight: 1.5,
    maxWidth: '280px',
    whiteSpace: 'pre-wrap' as any,
    textAlign: 'center',
    pointerEvents: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
};

const InfoIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => {
    const [show, setShow] = useState(false);
    return (
        <span
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '8px', cursor: 'help' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <span style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'rgba(155, 93, 229, 0.12)',
                color: '#9b5de5',
                fontSize: '11px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                userSelect: 'none',
            }}>i</span>
            {show && <div style={tooltipStyle}>{tooltip}</div>}
        </span>
    );
};

const options: Array<{
    value: 'this' | 'following' | 'all';
    label: string;
    tooltip?: string;
    disabled?: boolean;
}> = [
        {
            value: 'this',
            label: 'This upload only',
        },
        {
            value: 'following',
            label: 'This and all future uploads',
            disabled: true,
        },
        {
            value: 'all',
            label: 'All uploads',
            tooltip: 'All uploads from now on',
        },
    ];

const RecurringActionDialog: React.FC<RecurringActionDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    mode,
}) => {
    const [selectedOption, setSelectedOption] = useState<'this' | 'following' | 'all'>('this');

    if (!isOpen) return null;

    const titleText = mode === 'edit' ? 'Update recurring upload' : 'Delete recurring upload';
    const confirmLabel = mode === 'edit' ? 'Update' : 'Delete';

    return ReactDOM.createPortal(
        <div style={styles.overlay} onClick={onCancel}>
            <div style={styles.dialog} onClick={e => e.stopPropagation()}>
                <div style={styles.title}>{titleText}</div>
                <div style={styles.optionsList}>
                    {options.map(opt => {
                        const isSelected = selectedOption === opt.value;
                        const isDisabled = !!opt.disabled;
                        return (
                            <label
                                key={opt.value}
                                style={{
                                    ...styles.optionItem,
                                    ...(isSelected && !isDisabled ? {
                                        background: 'rgba(155, 93, 229, 0.05)',
                                        borderColor: 'rgba(155, 93, 229, 0.35)',
                                    } : {}),
                                    ...(isDisabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
                                }}
                            >
                                <input
                                    type="radio"
                                    name="recurring-option"
                                    value={opt.value}
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={() => !isDisabled && setSelectedOption(opt.value)}
                                    style={styles.radioInput}
                                />
                                <span style={styles.optionLabel}>{opt.label}</span>
                                {opt.tooltip && <InfoIcon tooltip={opt.tooltip} />}
                            </label>
                        );
                    })}
                </div>
                <div style={styles.buttonGroup}>
                    <button
                        style={{ ...styles.btn, ...styles.cancelBtn }}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            ...styles.btn,
                            ...styles.confirmBtn,
                            ...(mode === 'delete' ? {
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                            } : {}),
                        }}
                        onClick={() => onConfirm(selectedOption)}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RecurringActionDialog;
