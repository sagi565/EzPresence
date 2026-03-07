import React, { useState } from 'react';
import { Wrapper, Label, PasswordWrapper, Input, EyeBtn, EyeIcon } from './styles';

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Wrapper>
      <Label>{label}</Label>
      <PasswordWrapper>
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        <EyeBtn
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeIcon src="/icons/opened-eye.png" alt="" />
          ) : (
            <EyeIcon src="/icons/closed-eye.png" alt="" />
          )}
        </EyeBtn>
      </PasswordWrapper>
    </Wrapper>
  );
};

export default PasswordInput;