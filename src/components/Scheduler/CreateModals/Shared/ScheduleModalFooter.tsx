import React, { Dispatch, SetStateAction } from 'react';
import { sharedStyles } from './styles';

export interface ScheduleModalFooterProps {
    onSaveDraft: () => void;
    isDraftEnabled: boolean;
    isDraftHovered: boolean;
    setIsDraftHovered: Dispatch<SetStateAction<boolean>>;
    onSchedule: () => void;
    isSubmitting: boolean;
    isReadOnly: boolean;
    isFormValid: boolean;
    calendarItemId?: string;
    isDarkMode?: boolean;
}

export const ScheduleModalFooter: React.FC<ScheduleModalFooterProps> = ({
    onSaveDraft,
    isDraftEnabled,
    isDraftHovered,
    setIsDraftHovered,
    onSchedule,
    isSubmitting,
    isReadOnly,
    isFormValid,
    calendarItemId
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <button
                    className="shared-draft-btn"
                    onClick={onSaveDraft}
                    disabled={!isDraftEnabled}
                    onMouseEnter={() => setIsDraftHovered(true)}
                    onMouseLeave={() => setIsDraftHovered(false)}
                    style={{
                        ...sharedStyles.draftBtnStyle,
                        cursor: !isDraftEnabled ? 'not-allowed' : 'pointer',
                        opacity: !isDraftEnabled ? 0.5 : 1,
                        ...(isDraftHovered && isDraftEnabled ? { background: 'rgba(155, 93, 229, 0.1)', color: '#9b5de5', boxShadow: '0 2px 8px rgba(155, 93, 229, 0.2)' } : {})
                    }}
                >
                    Save as Draft
                </button>
                <button
                    className="shared-schedule-btn"
                    onClick={onSchedule}
                    disabled={isSubmitting || isReadOnly || !isFormValid}
                    style={{
                        ...sharedStyles.scheduleBtnStyle,
                        cursor: (isSubmitting || isReadOnly || !isFormValid) ? 'not-allowed' : 'pointer',
                        opacity: (isSubmitting || isReadOnly || !isFormValid) ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? 'Processing...' : (isReadOnly ? 'View Only' : (calendarItemId ? 'Update' : 'Schedule'))}
                </button>
            </div>
        </div>
    );
};
