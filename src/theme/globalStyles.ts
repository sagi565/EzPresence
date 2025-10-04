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

  :root {
    --color-primary: #9b5de5;
    --color-secondary: #fbbf24;
    --color-teal: #14b8a6;
    --color-blue: #3b82f6;
    --color-pink: #ec4899;
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

  @keyframes thinkingBounce {
    0%, 20%, 80%, 100% {
      transform: scale(0.8) translateY(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2) translateY(-8px);
      opacity: 1;
      background: var(--color-secondary);
    }
    60% {
      transform: scale(1) translateY(-4px);
      opacity: 0.8;
      background: var(--color-primary);
    }
  }

  @keyframes spinnerBounce {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }


  @keyframes tooltipFadeIn {
    to {
      opacity: 1;
    }
  }

  /* Generate button with white flash animation */
  .generate-button-wrapper {
    position: relative;
    overflow: hidden;
  }

  .generate-button-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.6s ease;
    pointer-events: none;
    z-index: 1;
  }

  .generate-button-wrapper:hover::before {
    left: 100%;
  }

  /* Model display shimmer effect */
  .model-display-shimmer::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
    pointer-events: none;
  }

  .model-display-shimmer:hover::before {
    left: 100%;
  }

  .loading-dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }

  .loading-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-primary);
    animation: thinkingBounce 1.4s infinite ease-in-out both;
  }

  .loading-dots span:nth-child(1) {
    animation-delay: -0.32s;
  }

  .loading-dots span:nth-child(2) {
    animation-delay: -0.16s;
  }

  .loading-dots span:nth-child(3) {
    animation-delay: 0s;
  }

  .loading-spinner {
    display: inline-flex;
    gap: 4px;
  }

  .loading-spinner span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-teal);
    animation: spinnerBounce 1.4s infinite ease-in-out both;
  }

  .loading-spinner span:nth-child(1) {
    animation-delay: -0.32s;
  }

  .loading-spinner span:nth-child(2) {
    animation-delay: -0.16s;
  }

  .loading-spinner span:nth-child(3) {
    animation-delay: 0s;
  }
@keyframes tooltipFadeIn {
    to {
      opacity: 1;
    }
  }

  /* Generate button with white flash animation */
  .generate-button-wrapper {
    position: relative;
    overflow: hidden;
  }

  .generate-button-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.6s ease;
    pointer-events: none;
    z-index: 1;
  }

  .generate-button-wrapper:hover::before {
    left: 100%;
  }

  /* Model display shimmer effect */
  .model-display-shimmer::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
    pointer-events: none;
  }

  .model-display-shimmer:hover::before {
    left: 100%;
  }

  @keyframes loadingDotAnim {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;