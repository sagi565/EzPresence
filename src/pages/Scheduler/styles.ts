import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  schedulerContainer: {
    maxWidth: '88vw',
    width: '100%',
    margin: '0 auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
  },
};