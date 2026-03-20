import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as S from './styles';

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
        <S.Overlay onClick={onCancel}>
            <S.Dialog onClick={e => e.stopPropagation()}>
                <S.TitleRow>
                    <S.Title>{title}</S.Title>
                </S.TitleRow>

                <S.Message>{message}</S.Message>

                <S.Actions>
                    <S.CancelBtn type="button" onClick={onCancel}>
                        {cancelLabel}
                    </S.CancelBtn>
                    <S.ConfirmBtn
                        type="button"
                        onClick={onConfirm}
                        $danger={danger}
                    >
                        {confirmLabel}
                    </S.ConfirmBtn>
                </S.Actions>
            </S.Dialog>
        </S.Overlay>,
        document.body
    );
};

export default ConfirmDialog;
