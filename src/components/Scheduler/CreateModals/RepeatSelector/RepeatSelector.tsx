import React, { useState } from 'react';
import { RepeatOption, RepeatFrequency, generateRepeatLabel, generateRruleText, CustomRepeatConfig } from '@/models/ScheduleFormData';
import { styles } from './styles';
import CustomRepeatDialog from './CustomRepeatDialog';
import SpecificDatesDialog from './SpecificDatesDialog';

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
    const [showCustom, setShowCustom] = useState(false);
    const [showSpecificDates, setShowSpecificDates] = useState(false);

    // If either dialog is open, we don't return null even if `!show`, 
    // because the `show` prop might be toggled off when a chip is clicked.
    // However, if the selector dropdown itself is requested closed:
    if (!show && !showCustom && !showSpecificDates) return null;

    const frequencies: RepeatFrequency[] = ['none', 'daily', 'weekly', 'monthly', 'annually', 'specific_dates', 'custom'];

    const handleSelect = (frequency: RepeatFrequency) => {
        if (frequency === 'custom') {
            setShowCustom(true);
            return;
        }
        if (frequency === 'specific_dates') {
            setShowSpecificDates(true);
            return;
        }

        const label = generateRepeatLabel(frequency, baseDate);
        const rruleText = generateRruleText(frequency, baseDate);
        onChange({ ...selectedRepeat, frequency, label, rruleText, customConfig: undefined, specificDates: undefined });
        onClose();
    };

    const handleCustomSave = (config: CustomRepeatConfig, label: string) => {
        onChange({ ...selectedRepeat, frequency: 'custom', label, customConfig: config, rruleText: undefined, specificDates: undefined });
        setShowCustom(false);
        onClose();
    };

    const handleSpecificDatesSave = (dates: Date[], label: string) => {
        onChange({ ...selectedRepeat, frequency: 'specific_dates', label, specificDates: dates, customConfig: undefined, rruleText: undefined });
        setShowSpecificDates(false);
        onClose();
    };

    return (
        <>
            {show && !showCustom && !showSpecificDates && (
                <div style={styles.container} className="repeat-selector" onClick={(e) => e.stopPropagation()}>
                    {frequencies.map((freq) => {
                        const labelText = generateRepeatLabel(freq, baseDate);
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
                                {labelText}
                            </button>
                        );
                    })}
                </div>
            )}

            <CustomRepeatDialog 
                isOpen={showCustom} 
                onClose={() => { setShowCustom(false); onClose(); }} 
                onSave={handleCustomSave} 
                baseDate={baseDate} 
            />

            <SpecificDatesDialog 
                isOpen={showSpecificDates} 
                onClose={() => { setShowSpecificDates(false); onClose(); }} 
                onSave={handleSpecificDatesSave} 
                baseDate={baseDate} 
            />
        </>
    );
};

export default RepeatSelector;
