import React, { ReactNode } from 'react';
import { styles } from './styles';

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
        <div className={className} style={{ ...styles.section, ...style }}>
            {icon && <div className="section-icon" style={styles.sectionIcon as React.CSSProperties}>{icon}</div>}
            <div className="section-content-wrapper" style={styles.sectionContent as React.CSSProperties}>
                {children}
            </div>
        </div>
    );
};

export default SectionContainer;
