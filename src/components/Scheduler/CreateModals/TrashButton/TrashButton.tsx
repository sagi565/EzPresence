import React, { ReactNode, CSSProperties } from 'react';
import * as S from './styles';

interface TrashButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    title?: string;
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
}

const TrashButton: React.FC<TrashButtonProps> = ({
    onClick,
    disabled,
    title = "Delete",
    children,
    style,
    className
}) => {
    return (
        <S.Button
            onClick={onClick}
            disabled={disabled}
            title={title}
            $hasChildren={!!children}
            $disabled={disabled}
            style={style}
            className={className}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ overflow: 'visible', flexShrink: 0 }}
            >
                <S.Lid className="trash-lid">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </S.Lid>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            {children}
        </S.Button>
    );
};

export default TrashButton;
