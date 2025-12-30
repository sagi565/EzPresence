import React, { useState } from 'react';
import { styles } from './styles';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  type?: 'text' | 'email';
  name?: string;
  autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  maxLength = 50,
  type = 'text',
  name,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        style={{
          ...styles.input,
          ...(isHovered && !isFocused ? styles.inputHovered : {}),
          ...(isFocused ? styles.inputFocused : {}),
          ...(error ? styles.inputError : {}),
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            onChange(e.target.value);
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        maxLength={maxLength}
      />
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

export default FormInput;