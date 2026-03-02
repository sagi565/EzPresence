import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    section: {
        display: 'flex',
        alignItems: 'flex-start',
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
        flexDirection: 'column',
        gap: '8px',
    },
};
