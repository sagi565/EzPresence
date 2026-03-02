import React, { ReactNode } from 'react';
import { styles } from './styles';

interface SectionContainerProps {
    icon: string | ReactNode;
    children: ReactNode;
}

/**
 * Shared section container component matching the demo's nsm-section styling.
 * Used for organizing form sections with icon + content layout.
 */
const SectionContainer: React.FC<SectionContainerProps> = ({ icon, children }) => {
    return (
        <div style={styles.section}>
            <div style={styles.sectionIcon}>
                {typeof icon === 'string' ? icon : icon}
            </div>
            <div style={styles.sectionContent}>
                {children}
            </div>
        </div>
    );
};

export default SectionContainer;
