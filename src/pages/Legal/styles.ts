import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
        borderBottom: '1px solid',
        borderColor: '#e5e7eb',
        padding: '20px 0',
        backgroundColor: '#ffffff',
    },
    headerContent: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 700,
        color: theme.colors.primary,
        textDecoration: 'none',
    },
    nav: {
        display: 'flex',
        gap: '24px',
    },
    navLink: {
        color: '#6b7280',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'color 0.2s',
    },
    main: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '48px 24px',
    },
    content: {
        lineHeight: '1.8',
        fontSize: '16px',
    },
    footer: {
        borderTop: '1px solid',
        borderColor: '#e5e7eb',
        padding: '32px 0',
        marginTop: '64px',
        backgroundColor: '#f9fafb',
    },
    footerContent: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 24px',
        textAlign: 'center' as const,
        color: '#6b7280',
        fontSize: '14px',
    },
    footerLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '16px',
    },
    footerLink: {
        color: '#6b7280',
        textDecoration: 'none',
        fontSize: '14px',
        transition: 'color 0.2s',
    },
};

// Styles for rendered markdown content
export const contentStyles = `
  .legal-content h1 {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #000000;
    line-height: 1.2;
  }

  .legal-content h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 48px 0 16px 0;
    color: #000000;
    line-height: 1.3;
  }

  .legal-content h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 32px 0 12px 0;
    color: #111827;
    line-height: 1.4;
  }

  .legal-content h4 {
    font-size: 18px;
    font-weight: 600;
    margin: 24px 0 12px 0;
    color: #111827;
    line-height: 1.4;
  }

  .legal-content p {
    margin: 16px 0;
    color: #374151;
  }

  .legal-content ul, .legal-content ol {
    margin: 16px 0;
    padding-left: 24px;
    color: #374151;
  }

  .legal-content li {
    margin: 8px 0;
  }

  .legal-content a {
    color: ${theme.colors.primary};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }

  .legal-content a:hover {
    border-bottom-color: ${theme.colors.primary};
  }

  .legal-content strong {
    font-weight: 600;
    color: #111827;
  }

  .legal-content em {
    font-style: italic;
    color: #6b7280;
  }

  .legal-content hr {
    border: none;
    border-top: 1px solid;
    border-color: #e5e7eb;
    margin: 32px 0;
  }

  .legal-content blockquote {
    border-left: 4px solid;
    border-color: #e5e7eb;
    padding-left: 16px;
    margin: 16px 0;
    color: #6b7280;
    font-style: italic;
  }

  @media print {
    .legal-content {
      font-size: 12pt;
      line-height: 1.6;
    }
  }
`;
