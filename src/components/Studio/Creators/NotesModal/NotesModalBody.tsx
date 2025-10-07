import React, { useState } from 'react';
import { styles } from './styles';
import { theme } from '@theme/theme';

interface SelectedOptions {
  theme: string | null;
  logo: string;
  sound: string;
}

interface NotesModalBodyProps {
  textInput: string;
  setTextInput: (value: string) => void;
  selectedOptions: SelectedOptions;
  setSelectedOptions: (options: SelectedOptions) => void;
  errors: { text: boolean; theme: boolean };
}

interface Theme {
  id: string;
  name: string;
  gradient: string;
}

interface Sound {
  id: string;
  name: string;
  favorite?: boolean;
}

const THEMES: Theme[] = [
  { id: 'black-ribbon', name: 'Black Ribbon', gradient: 'linear-gradient(135deg, #111, #1c1f2a)' },
  { id: 'classic-pad', name: 'Classic Pad', gradient: 'linear-gradient(135deg, #f8f7ee, #e3dcc5)' },
  { id: 'plain-white', name: 'Plain White', gradient: 'linear-gradient(135deg, #ffffff, #eceff4)' },
  { id: 'camping', name: 'Camping', gradient: 'linear-gradient(135deg, #162f2b, #0a7b54)' },
  { id: 'campfire', name: 'Campfire', gradient: 'linear-gradient(135deg, #43190f, #ff7a3d)' },
  { id: 'hacked', name: 'Hacked', gradient: 'linear-gradient(135deg, #071a0f, #17c964)' },
];

const SOUNDS: Sound[] = [
  { id: 'none', name: 'None' },
  { id: 'upbeat', name: 'Upbeat', favorite: true },
  { id: 'chill', name: 'Chill', favorite: true },
  { id: 'epic', name: 'Epic', favorite: true },
  { id: 'ambient', name: 'Ambient', favorite: true },
  { id: 'jazz', name: 'Jazz' },
  { id: 'classical', name: 'Classical' },
  { id: 'electronic', name: 'Electronic' },
  { id: 'nature', name: 'Nature' },
  { id: 'motivate', name: 'Motivate' },
  { id: 'peaceful', name: 'Peaceful' },
];

const NotesModalBody: React.FC<NotesModalBodyProps> = ({
  textInput,
  setTextInput,
  selectedOptions,
  setSelectedOptions,
  errors,
}) => {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);
  const [hoveredSound, setHoveredSound] = useState<string | null>(null);
  const [hoveredLibraryBtn, setHoveredLibraryBtn] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedOptions({ ...selectedOptions, theme: themeId });
  };

  const handleLogoSelect = (logoId: string) => {
    if (logoId === 'add') {
      alert('Opening logo upload interface...');
      return;
    }
    setSelectedOptions({ ...selectedOptions, logo: logoId });
  };

  const handleSoundSelect = (soundId: string) => {
    setSelectedOptions({ ...selectedOptions, sound: soundId });
  };

  return (
    <div style={styles.modalBody}>
      <div style={styles.leftColumn}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Text (required)</label>
          <textarea
            style={{
              ...styles.textarea,
              ...(errors.text ? styles.textareaError : {}),
            }}
            placeholder="Write your thoughts. Describe the message, vibe, and key beats you want to hit..."
            value={textInput}
            onChange={handleTextChange}
          />
          <div style={styles.helper}>
            We'll source visuals and timing from your intent—no footage required.
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Theme (required)</label>
          <div style={styles.themeGrid}>
            {THEMES.map((themeItem) => {
              const isSelected = selectedOptions.theme === themeItem.id;
              const isHovered = hoveredTheme === themeItem.id;
              const hasError = errors.theme;

              return (
                <div
                  key={themeItem.id}
                  style={{
                    ...styles.themeOption,
                    ...(isHovered ? styles.themeOptionHover : {}),
                    ...(isSelected ? styles.themeOptionSelected : {}),
                    ...(hasError ? styles.themeOptionError : {}),
                  }}
                  onClick={() => handleThemeSelect(themeItem.id)}
                  onMouseEnter={() => setHoveredTheme(themeItem.id)}
                  onMouseLeave={() => setHoveredTheme(null)}
                >
                  <div
                    style={{
                      ...styles.themeThumbnail,
                      background: themeItem.gradient,
                    }}
                  >
                    <div style={styles.themeName}>{themeItem.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.rightColumn}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Logo Image</label>
          <div style={styles.logoSelector}>
            <div
              style={{
                ...styles.logoOption,
                ...(selectedOptions.logo === 'none' ? styles.logoOptionSelected : {}),
                ...(hoveredLogo === 'none' ? styles.logoOptionHover : {}),
              }}
              onClick={() => handleLogoSelect('none')}
              onMouseEnter={() => setHoveredLogo('none')}
              onMouseLeave={() => setHoveredLogo(null)}
            >
              <span style={styles.logoIcon}>🚫</span>
              <span style={styles.logoText}>None</span>
            </div>

            <div
              style={{
                ...styles.logoOption,
                ...(selectedOptions.logo === 'saved' ? styles.logoOptionSelected : {}),
                ...(hoveredLogo === 'saved' ? styles.logoOptionHover : {}),
              }}
              onClick={() => handleLogoSelect('saved')}
              onMouseEnter={() => setHoveredLogo('saved')}
              onMouseLeave={() => setHoveredLogo(null)}
            >
              <div style={styles.logoSaved}>🍔</div>
            </div>

            <div
              style={{
                ...styles.logoOption,
                ...(hoveredLogo === 'add' ? styles.logoOptionHover : {}),
              }}
              onClick={() => handleLogoSelect('add')}
              onMouseEnter={() => setHoveredLogo('add')}
              onMouseLeave={() => setHoveredLogo(null)}
            >
              <div style={styles.logoAdd}>
                <span style={styles.logoIcon}>➕</span>
                <span style={styles.logoAddText}>Add New</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Background Sound</label>
          <div style={styles.soundGrid}>
            {SOUNDS.map((sound) => {
              const isSelected = selectedOptions.sound === sound.id;
              const isHovered = hoveredSound === sound.id;

              return (
                <div
                  key={sound.id}
                  style={{
                    ...styles.soundOption,
                    ...(isSelected ? styles.soundOptionSelected : {}),
                    ...(isHovered ? styles.soundOptionHover : {}),
                  }}
                  onClick={() => handleSoundSelect(sound.id)}
                  onMouseEnter={() => setHoveredSound(sound.id)}
                  onMouseLeave={() => setHoveredSound(null)}
                >
                  <span style={styles.soundIcon}>
                    {sound.id === 'none' ? '🚫' : '▶️'}
                  </span>
                  <span style={styles.soundName}>{sound.name}</span>
                  {sound.favorite && <span style={styles.soundFavorite}>❤️</span>}
                </div>
              );
            })}
          </div>
          <button
            style={{
              ...styles.libraryBtn,
              ...(hoveredLibraryBtn ? styles.libraryBtnHover : {}),
            }}
            onMouseEnter={() => setHoveredLibraryBtn(true)}
            onMouseLeave={() => setHoveredLibraryBtn(false)}
          >
            Choose from library
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModalBody;