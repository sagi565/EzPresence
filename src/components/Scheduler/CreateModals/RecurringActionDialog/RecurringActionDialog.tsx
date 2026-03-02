import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles';

interface RecurringActionDialogProps {
    isOpen: boolean;
    onConfirm: (option: 'this' | 'following' | 'all') => void;
    onCancel: () => void;
    mode: 'edit' | 'delete';
}

const RecurringActionDialog: React.FC<RecurringActionDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    mode
}) => {
    const [selectedOption, setSelectedOption] = useState<'this' | 'following' | 'all'>('this');

    if (!isOpen) return null;

    const titleText = mode === 'edit' ? 'Edit recurring event' : 'Delete recurring event';
    const thisEventLabel = 'This event';
    const followingEventsLabel = 'This and following events';
    const allEventsLabel = 'All events';
    const cancelLabel = 'Cancel';
    const confirmLabel = 'OK';

    return ReactDOM.createPortal(
        <div style={styles.overlay} onClick={onCancel}>
            <div style={styles.dialog} onClick={e => e.stopPropagation()}>
                <div style={styles.title}>{titleText}</div>
                <div style={styles.optionsList}>
                    <label style={{
                        ...styles.optionItem,
                        ...(selectedOption === 'this' ? {
                            background: 'rgba(155, 93, 229, 0.05)',
                            borderColor: 'rgba(155, 93, 229, 0.3)',
                        } : {})
                    }}>
                        <input
                            type="radio"
                            name="recurring-option"
                            value="this"
                            checked={selectedOption === 'this'}
                            onChange={() => setSelectedOption('this')}
                            style={styles.radioInput}
                        />
                        <span style={styles.optionLabel}>{thisEventLabel}</span>
                    </label>
                    <label
                        style={{ ...styles.optionItem, opacity: 0.5, cursor: 'not-allowed' }}
                        title="Updating following events is not supported by the API currently"
                    >
                        <input
                            type="radio"
                            name="recurring-option"
                            value="following"
                            checked={selectedOption === 'following'}
                            onChange={() => { }} // Disabled
                            disabled
                            style={styles.radioInput}
                        />
                        <span style={styles.optionLabel}>{followingEventsLabel}</span>
                    </label>
                    <label style={{
                        ...styles.optionItem,
                        ...(selectedOption === 'all' ? {
                            background: 'rgba(155, 93, 229, 0.05)',
                            borderColor: 'rgba(155, 93, 229, 0.3)',
                        } : {})
                    }}>
                        <input
                            type="radio"
                            name="recurring-option"
                            value="all"
                            checked={selectedOption === 'all'}
                            onChange={() => setSelectedOption('all')}
                            style={styles.radioInput}
                        />
                        <span style={styles.optionLabel}>{allEventsLabel}</span>
                    </label>
                </div>
                <div style={styles.buttonGroup}>
                    <button
                        style={{ ...styles.btn, ...styles.cancelBtn }}
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        style={{ ...styles.btn, ...styles.confirmBtn }}
                        onClick={() => onConfirm(selectedOption)}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RecurringActionDialog;
