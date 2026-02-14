import React, { ReactNode } from 'react';

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

const styles = {
    section: {
        display: 'flex',
        alignItems: 'flex-start' as const,
        gap: '14px',
    },
    sectionIcon: {
        width: '28px',
        height: '28px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
        marginTop: '4px',
        opacity: 0.65,
    },
    sectionContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
    }
};

export default SectionContainer;
