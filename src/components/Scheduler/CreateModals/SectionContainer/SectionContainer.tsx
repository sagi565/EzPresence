import React, { ReactNode } from 'react';
import * as S from './styles';

interface SectionContainerProps {
    icon: string | ReactNode;
    children: ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

/**
 * Shared section container component matching the demo's nsm-section styling.
 * Used for organizing form sections with icon + content layout.
 */
const SectionContainer: React.FC<SectionContainerProps> = ({ icon, children, className, style }) => {
    return (
        <S.Container className={className} style={style}>
            {icon && <S.Icon className="section-icon">{icon}</S.Icon>}
            <S.Content className="section-content-wrapper">
                {children}
            </S.Content>
        </S.Container>
    );
};

export default SectionContainer;
