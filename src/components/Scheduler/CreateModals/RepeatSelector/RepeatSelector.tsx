import React from 'react';
import { RepeatOption, RepeatFrequency, generateRepeatLabel, generateRruleText } from '@/models/ScheduleFormData';
import * as S from './styles';

interface RepeatSelectorProps {
    repeat: RepeatOption;
    onChange: (repeat: RepeatOption) => void;
    baseDate: Date;
    show: boolean;
    onClose: () => void;
}

const RepeatSelector: React.FC<RepeatSelectorProps> = ({
    repeat,
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
        const rruleText = generateRruleText(frequency, baseDate);
        onChange({ ...repeat, frequency, label, rruleText });
        onClose();
    };

    return (
        <S.Container $show={show} className="repeat-selector" onClick={(e) => e.stopPropagation()}>
            {frequencies.map((freq) => {
                const label = generateRepeatLabel(freq, baseDate);
                const isActive = repeat.frequency === freq;

                return (
                    <S.Option
                        key={freq}
                        className="nsm-repeat-option"
                        $isActive={isActive}
                        onClick={() => handleSelect(freq)}
                    >
                        {label}
                    </S.Option>
                );
            })}
        </S.Container>
    );
};

export default RepeatSelector;
