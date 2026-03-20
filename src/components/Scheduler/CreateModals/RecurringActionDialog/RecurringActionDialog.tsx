import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import * as S from './styles';

interface RecurringActionDialogProps {
    isOpen: boolean;
    onConfirm: (option: 'this' | 'following' | 'all') => void;
    onCancel: () => void;
    mode: 'edit' | 'delete';
}

const InfoIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => {
    const [show, setShow] = useState(false);
    return (
        <S.InfoIconWrapper
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <S.InfoBadge>i</S.InfoBadge>
            {show && <S.Tooltip>{tooltip}</S.Tooltip>}
        </S.InfoIconWrapper>
    );
};

const options: Array<{
    value: 'this' | 'following' | 'all';
    label: string;
    tooltip?: string;
    disabled?: boolean;
}> = [
        {
            value: 'this',
            label: 'This upload only',
        },
        {
            value: 'following',
            label: 'This and all future uploads',
            disabled: true,
        },
        {
            value: 'all',
            label: 'All uploads',
            tooltip: 'All uploads from now on',
        },
    ];

const RecurringActionDialog: React.FC<RecurringActionDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    mode,
}) => {
    const [selectedOption, setSelectedOption] = useState<'this' | 'following' | 'all'>('this');

    if (!isOpen) return null;

    const titleText = mode === 'edit' ? 'Update recurring upload' : 'Delete recurring upload';
    const confirmLabel = mode === 'edit' ? 'Update' : 'Delete';

    return ReactDOM.createPortal(
        <S.Overlay onClick={onCancel}>
            <S.Dialog onClick={e => e.stopPropagation()}>
                <S.Title>{titleText}</S.Title>
                <S.OptionsList>
                    {options.map(opt => {
                        const isSelected = selectedOption === opt.value;
                        const isDisabled = !!opt.disabled;
                        return (
                            <S.OptionItem
                                key={opt.value}
                                $isSelected={isSelected}
                                $isDisabled={isDisabled}
                            >
                                <input
                                    type="radio"
                                    name="recurring-option"
                                    value={opt.value}
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={() => !isDisabled && setSelectedOption(opt.value)}
                                    style={{ display: 'none' }}
                                />
                                <S.RadioInput $isSelected={isSelected} />
                                <S.OptionLabel>{opt.label}</S.OptionLabel>
                                {opt.tooltip && <InfoIcon tooltip={opt.tooltip} />}
                            </S.OptionItem>
                        );
                    })}
                </S.OptionsList>
                <S.ButtonGroup>
                    <S.CancelBtn onClick={onCancel}>
                        Cancel
                    </S.CancelBtn>
                    <S.ConfirmBtn
                        $isDelete={mode === 'delete'}
                        onClick={() => onConfirm(selectedOption)}
                    >
                        {confirmLabel}
                    </S.ConfirmBtn>
                </S.ButtonGroup>
            </S.Dialog>
        </S.Overlay>,
        document.body
    );
};

export default RecurringActionDialog;
