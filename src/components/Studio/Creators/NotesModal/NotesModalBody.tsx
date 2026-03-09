import React from 'react';
import { 
  ModalBody, 
  LeftColumn, 
  RightColumn, 
  FormGroup, 
  Label, 
  Textarea, 
  HelperText, 
  ThemeGrid, 
  ThemeOption, 
  ThemeThumbnail, 
  ThemeName,
  LogoSelector,
  LogoOption,
  LogoIcon,
  LogoText,
  LogoSaved,
  LogoAdd,
  LogoAddText,
  SoundGrid,
  SoundOption,
  SoundIcon,
  SoundName,
  SoundFavorite,
  LibraryBtn
} from './styles';

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
    <ModalBody>
      <LeftColumn>
        <FormGroup>
          <Label>Text (required)</Label>
          <Textarea
            $error={errors.text}
            placeholder="Write your thoughts. Describe the message, vibe, and key beats you want to hit..."
            value={textInput}
            onChange={handleTextChange}
          />
          <HelperText>
            We'll source visuals and timing from your intent—no footage required.
          </HelperText>
        </FormGroup>

        <FormGroup>
          <Label>Theme (required)</Label>
          <ThemeGrid>
            {THEMES.map((themeItem) => (
              <ThemeOption
                key={themeItem.id}
                $selected={selectedOptions.theme === themeItem.id}
                $error={errors.theme}
                onClick={() => handleThemeSelect(themeItem.id)}
              >
                <ThemeThumbnail style={{ background: themeItem.gradient }}>
                  <ThemeName>{themeItem.name}</ThemeName>
                </ThemeThumbnail>
              </ThemeOption>
            ))}
          </ThemeGrid>
        </FormGroup>
      </LeftColumn>

      <RightColumn>
        <FormGroup>
          <Label>Logo Image</Label>
          <LogoSelector>
            <LogoOption
              $selected={selectedOptions.logo === 'none'}
              onClick={() => handleLogoSelect('none')}
            >
              <LogoIcon>🚫</LogoIcon>
              <LogoText>None</LogoText>
            </LogoOption>

            <LogoOption
              $selected={selectedOptions.logo === 'saved'}
              onClick={() => handleLogoSelect('saved')}
            >
              <LogoSaved>🍔</LogoSaved>
            </LogoOption>

            <LogoOption onClick={() => handleLogoSelect('add')}>
              <LogoAdd>
                <LogoIcon>➕</LogoIcon>
                <LogoAddText>Add New</LogoAddText>
              </LogoAdd>
            </LogoOption>
          </LogoSelector>
        </FormGroup>

        <FormGroup>
          <Label>Background Sound</Label>
          <SoundGrid>
            {SOUNDS.map((sound) => (
              <SoundOption
                key={sound.id}
                $selected={selectedOptions.sound === sound.id}
                onClick={() => handleSoundSelect(sound.id)}
              >
                <SoundIcon>
                  {sound.id === 'none' ? '🚫' : '▶️'}
                </SoundIcon>
                <SoundName>{sound.name}</SoundName>
                {sound.favorite && <SoundFavorite>❤️</SoundFavorite>}
              </SoundOption>
            ))}
          </SoundGrid>
          <LibraryBtn>Choose from library</LibraryBtn>
        </FormGroup>
      </RightColumn>
    </ModalBody>
  );
};

export default NotesModalBody;