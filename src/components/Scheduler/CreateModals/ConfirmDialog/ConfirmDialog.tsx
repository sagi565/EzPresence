import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { theme } from '@/theme/theme';
import { styles } from './styles';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = false,
    onConfirm,
    onCancel
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <>
            <div
                style={styles.overlay}
                onClick={onCancel}
            >
                <div
                    style={styles.dialog}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={styles.titleRow}>
                        <h3 style={styles.title}>
                            {title}
                        </h3>
                    </div>

                    <p style={styles.message}>
                        {message}
                    </p>

                    <div style={styles.actions}>
                        <button
                            type="button"
                            onClick={onCancel}
                            style={styles.cancelBtn}
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            style={{
                                ...styles.confirmBtn,
                                background: danger ? '#EF4444' : theme.gradients.innovator,
                                boxShadow: danger
                                    ? '0 3px 12px rgba(239, 68, 68, 0.3)'
                                    : '0 3px 12px rgba(155, 93, 229, 0.25)',
                            }}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes confirmDialogFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </>,
        document.body
    );
};

export default ConfirmDialog;
