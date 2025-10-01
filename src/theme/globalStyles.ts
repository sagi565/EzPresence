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

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes focusAppear {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes expandToDetail {
    from {
      transform: translate(-50%, -50%) scale(0.9);
      opacity: 0.8;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes celebrationPulse {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    20% {
      transform: scale(1.2);
      opacity: 1;
    }
    40% {
      transform: scale(0.95);
    }
    60% {
      transform: scale(1.05);
    }
    80% {
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }

  @keyframes confettiFall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`;