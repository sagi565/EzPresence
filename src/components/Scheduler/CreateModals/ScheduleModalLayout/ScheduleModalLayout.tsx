import React, { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';
import TrashButton from '../TrashButton/TrashButton';
import * as S from './styles';

interface ScheduleModalLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
    title: string;
    icon?: string;
    headerContent?: ReactNode;
    beforeBody?: ReactNode;
    children: ReactNode;
    rightColumn?: ReactNode;
    footerLeft?: ReactNode;
    footerRight?: ReactNode;
    width?: string;
    height?: string;
    scrollableBody?: boolean;
    onOverlayClick?: () => void;
}

const ScheduleModalLayout: React.FC<ScheduleModalLayoutProps> = ({
    isOpen,
    onClose,
    onDelete,
    isDeleting,
    title,
    icon,
    headerContent,
    beforeBody,
    children,
    rightColumn,
    footerLeft,
    footerRight,
    width = '1020px',
    height,
    scrollableBody = false,
    onOverlayClick
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                if (onOverlayClick) onOverlayClick();
                else onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose, onOverlayClick]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <S.Overlay
                onClick={onOverlayClick || onClose}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
            />
            <S.Modal
                $width={width}
                $height={height}
                className="schedule-modal-layout"
            >
                <S.Header>
                    <S.HeaderLeft>
                        {icon && <S.Icon>{icon}</S.Icon>}
                        {headerContent || <S.Title>{title}</S.Title>}
                    </S.HeaderLeft>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {onDelete && (
                            <TrashButton onClick={onDelete} disabled={isDeleting} title="Delete" />
                        )}
                        <S.CloseButton className="modal-close-btn" onClick={onClose}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </S.CloseButton>
                    </div>
                </S.Header>

                <S.Body $scrollable={scrollableBody}>
                    <S.LeftColumn className="schedule-modal-layout-left">
                        {beforeBody && <div className="schedule-modal-before-body">{beforeBody}</div>}
                        {children}
                    </S.LeftColumn>
                    <S.RightColumn className="schedule-modal-layout-right">
                        {rightColumn}
                    </S.RightColumn>
                </S.Body>

                {(footerLeft || footerRight) && (
                    <S.Footer className="schedule-modal-layout-footer">
                        <div>{footerLeft}</div>
                        <div>{footerRight}</div>
                    </S.Footer>
                )}
            </S.Modal>
        </>,
        document.body
    );
};

export default ScheduleModalLayout;