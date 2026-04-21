import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Overlay, Dialog, IconWrap, Title, Message, Actions, CancelBtn, ConfirmBtn } from './styles';

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

    return createPortal(
        <>
            <Overlay onClick={onCancel} />
            <Dialog>
                <IconWrap $danger={danger}>
                    {danger ? <Trash2 size={22} /> : <AlertTriangle size={22} />}
                </IconWrap>
                <Title>{title}</Title>
                <Message>{message}</Message>
                <Actions>
                    <CancelBtn type="button" onClick={onCancel}>{cancelLabel}</CancelBtn>
                    <ConfirmBtn type="button" $danger={danger} onClick={onConfirm}>{confirmLabel}</ConfirmBtn>
                </Actions>
            </Dialog>
        </>,
        document.body
    );
};

export default ConfirmDialog;
