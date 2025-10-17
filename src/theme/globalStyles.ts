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
    font-family: Figtree, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
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

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
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

@keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
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

  @keyframes loadingDotAnim {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

@keyframes pulseLogo {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .login-separator {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
  color: #888;
  position: relative;
  }
  
  .login-separator::before,
  .login-separator::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #ccc;
    position: relative;
    top: 0;
  }
  .login-separator::before {
    margin-right: 8px;
  }
  .login-separator::after {
    margin-left: 8px;
  }
@keyframes favoriteClick {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Hide scrollbar for content lists */
  .list-scroll-wrapper::-webkit-scrollbar {
    display: none;
  }

  /* Ensure content item title and date show on hover */
  .content-item:hover .content-title,
  .content-item:hover .content-date {
    opacity: 1 !important;
  }

  /* Content item gradient overlay on hover */
  .content-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .content-item:hover::after {
    opacity: 1;
  }

  /* Upload button hover effects */
  .upload-button:hover .upload-icon {
    transform: scale(1.1);
  }

  /* Scroll arrow hover effects */
  .scroll-arrow:hover {
    background: rgba(0, 0, 0, 0.25) !important;
    opacity: 1 !important;
  }

  /* Delete button tooltip */
  .delete-item-btn::after {
    content: 'Delete';
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
    background: rgba(17, 24, 39, 0.95);
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    z-index: 1000;
  }

  .delete-item-btn:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* List delete button hover effects */
  .list-delete-btn:hover {
    background: #ef4444 !important;
    border-color: #dc2626 !important;
    color: white !important;
    transform: scale(1.08) !important;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3) !important;
  }

  /* Action button hover effects */
  .action-btn:hover {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .action-btn-wizard:hover {
    transform: scale(1.15) rotate(15deg);
    box-shadow: 0 8px 24px rgba(155, 93, 229, 0.4);
  }

  /* Context menu hover */
  .scroll-nav-context-item:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
`;