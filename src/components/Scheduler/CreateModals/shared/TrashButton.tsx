import React, { useState, ReactNode, CSSProperties } from 'react';

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
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const baseStyle: CSSProperties = {
        width: children ? 'auto' : '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: children ? '12px' : '50%',
        background: isHovered ? 'rgba(239, 68, 68, .2)' : 'rgba(239, 68, 68, .1)',
        color: isHovered ? '#DC2626' : '#EF4444',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        padding: children ? '0 16px' : 0,
        position: 'relative',
        overflow: 'visible',
        outline: 'none',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 600,
        ...style
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={baseStyle}
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
                {/* Lid Group */}
                <g style={{
                    transform: isHovered ? 'translateY(-2px) rotate(-15deg)' : 'translateY(0) rotate(0)',
                    transformOrigin: '4px 7px',
                    transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </g>
                {/* Body Group */}
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            {children}
        </button>
    );
};

export default TrashButton;
