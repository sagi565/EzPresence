import React from 'react';
import { theme } from '@/theme/theme';

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
    if (!isOpen) return null;

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={onCancel}
            >
                <div
                    style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '28px 32px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                        animation: 'confirmDialogFadeIn 0.2s ease-out',
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                    }}>
                        {danger && (
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </div>
                        )}
                        <h3 style={{
                            margin: 0,
                            fontSize: '17px',
                            fontWeight: 700,
                            color: theme.colors.text,
                        }}>
                            {title}
                        </h3>
                    </div>

                    <p style={{
                        margin: '0 0 24px 0',
                        fontSize: '14px',
                        color: theme.colors.muted,
                        lineHeight: 1.5,
                    }}>
                        {message}
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px',
                    }}>
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '9px 20px',
                                borderRadius: '10px',
                                border: '1px solid #E5E7EB',
                                background: '#fff',
                                color: theme.colors.text,
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            style={{
                                padding: '9px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                background: danger ? '#EF4444' : theme.gradients.innovator,
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
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
        </>
    );
};

export default ConfirmDialog;
