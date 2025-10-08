import React from 'react';
import { styles } from './styles';

type Props = {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
};

const AuthField: React.FC<Props> = ({
  label, type = 'text', value, onChange, autoComplete, placeholder,
}) => (
  <label style={styles.wrapper}>
    <span style={styles.label}>{label}</span>
    <input
      style={styles.input}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      placeholder={placeholder}
    />
  </label>
);

export default AuthField;
