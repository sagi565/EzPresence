import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

type S = Record<string, CSSProperties>;

export const styles: S = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 16,
  },
  btn: {
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleBtn: {
    background: '#fff',
    color: '#3c4043',
    border: '1px solid',
    borderColor: '#dadce0',
  },
  facebookBtn: {
    background: '#1877F2',
    color: '#fff',
    border: 'none',
  },
};
