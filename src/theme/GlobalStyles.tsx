import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    overflow-y: auto;
    overflow-x: clip;
  }

  body {
    font-family: Figtree, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    background: ${props => props.theme.gradients.background};
    color: ${props => props.theme.colors.text};
    min-height: 100vh;
    transition: background 0.3s ease, color 0.3s ease;
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

  /* Scrollbar styles for the whole app */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.bg};
  }
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}40;
    border-radius: 5px;
    border: 2px solid ${props => props.theme.colors.bg};
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary}60;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Re-including the specific utility classes from the original globalStyles */
  .loading-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-primary);
    animation: thinkingBounce 1.4s infinite ease-in-out both;
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

  .list-delete-btn:hover {
    background: #ef4444 !important;
    border-color: #dc2626 !important;
    color: white !important;
    transform: scale(1.08) !important;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3) !important;
  }
`;
