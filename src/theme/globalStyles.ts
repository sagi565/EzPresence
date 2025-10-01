import { theme } from './theme';

export const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: ${theme.gradients.background};
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
  }

  button {
    font-family: inherit;
  }
`;