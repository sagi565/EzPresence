import React from 'react';
import { Wrapper, Label, Input } from './styles';

type AuthFieldProps = {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
};

const AuthField: React.FC<AuthFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  placeholder,
}) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
    </Wrapper>
  );
};

export default AuthField;
