import React, { useState } from 'react';
import { styles } from './styles';

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
};

const EyeIcon = () => (
  <img src="/icons/opened-eye.png" alt="Show password" style={styles.eyeIcon} />
);
const EyeOffIcon = () => (
  <img src="/icons/closed-eye.png" alt="Hide password" style={styles.eyeIcon} />
);

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputContainer}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
        <button
          type="button"
          style={styles.toggleBtn}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
