import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppTheme } from '@theme/ThemeContext';
import { ToggleBtn, AnimatedIcon } from './styles';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useAppTheme();

  return (
    <ToggleBtn
      $dark={isDarkMode}
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      <AnimatedIcon key={isDarkMode ? 'dark' : 'light'}>
        {isDarkMode
          ? <Moon size={16} color="#a78bfa" strokeWidth={2.2} />
          : <Sun size={16} color="#fbbf24" strokeWidth={2.2} />
        }
      </AnimatedIcon>
    </ToggleBtn>
  );
};

export default ThemeToggle;
