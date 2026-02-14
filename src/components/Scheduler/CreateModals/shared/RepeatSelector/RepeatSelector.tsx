import React from 'react';
import { RepeatOption, RepeatFrequency, generateRepeatLabel } from '@/models/ScheduleFormData';
import { styles } from './styles';

interface RepeatSelectorProps {
    selectedRepeat: RepeatOption;
    onChange: (repeat: RepeatOption) => void;
    baseDate: Date;
    show: boolean;
    onClose: () => void;
}

const RepeatSelector: React.FC<RepeatSelectorProps> = ({
    selectedRepeat,
    onChange,
    baseDate,
    show,
    onClose,
}) => {
    if (!show) return null;

    const frequencies: RepeatFrequency[] = ['none', 'daily', 'weekly', 'monthly', 'annually', 'custom'];

    const handleSelect = (frequency: RepeatFrequency) => {
        if (frequency === 'custom') {
            alert('Custom repeat coming soon!');
            return;
        }

        const label = generateRepeatLabel(frequency, baseDate);
        onChange({ frequency, label });
        onClose();
    };

    return (
        <div style={styles.container} className="repeat-selector" onClick={(e) => e.stopPropagation()}>
            {frequencies.map((freq) => {
                const label = generateRepeatLabel(freq, baseDate);
                const isActive = selectedRepeat.frequency === freq;

                return (
                    <button
                        key={freq}
                        className="nsm-repeat-option"
                        style={{
                            ...styles.option,
                            ...(isActive ? styles.optionActive : {}),
                        }}
                        onClick={() => handleSelect(freq)}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

export default RepeatSelector;
