import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { styles, contentStyles } from './styles';

interface LegalPageProps {
    title: string;
    content: string;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, content }) => {
    // Set page title and meta tags
    useEffect(() => {
        document.title = `${title} | EZpresence`;

        // Set or update robots meta tag
        let robotsMeta = document.querySelector('meta[name="robots"]');
        if (!robotsMeta) {
            robotsMeta = document.createElement('meta');
            robotsMeta.setAttribute('name', 'robots');
            document.head.appendChild(robotsMeta);
        }
        robotsMeta.setAttribute('content', 'index, follow');

        // Set description meta tag
        let descriptionMeta = document.querySelector('meta[name="description"]');
        if (!descriptionMeta) {
            descriptionMeta = document.createElement('meta');
            descriptionMeta.setAttribute('name', 'description');
            document.head.appendChild(descriptionMeta);
        }
        descriptionMeta.setAttribute(
            'content',
            `${title} for EZpresence - AI-powered social media management platform`
        );

        return () => {
            document.title = 'EZpresence';
        };
    }, [title]);

    // Convert markdown to HTML (simple conversion for basic markdown)
    const convertMarkdownToHTML = (markdown: string): string => {
        let html = markdown;

        // Convert headers
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

        // Convert bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Convert italic
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');

        // Convert links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Convert horizontal rules
        html = html.replace(/^---$/gim, '<hr>');

        // Convert unordered lists
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Convert paragraphs (lines that aren't already HTML tags)
        const lines = html.split('\n');
        const processedLines = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed === '') return '';
            if (trimmed.startsWith('<')) return line;
            return `<p>${line}</p>`;
        });
        html = processedLines.join('\n');

        return html;
    };

    const htmlContent = convertMarkdownToHTML(content);

    return (
        <div style={styles.container}>
            <style>{contentStyles}</style>

            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <Link to="/" style={styles.logo}>
                        EZpresence
                    </Link>
                    <nav style={styles.nav}>
                        <Link
                            to="/terms-of-service"
                            style={styles.navLink}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                        >
                            Terms of Service
                        </Link>
                        <Link
                            to="/privacy-policy"
                            style={styles.navLink}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                        >
                            Privacy Policy
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main style={styles.main}>
                <div style={styles.content}>
                    <div
                        className="legal-content"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </div>

                {/* Footer */}
                <footer style={styles.footer}>
                    <div style={styles.footerContent}>
                        <div style={styles.footerLinks}>
                            <Link
                                to="/terms-of-service"
                                style={styles.footerLink}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                            >
                                Terms of Service
                            </Link>
                            <Link
                                to="/privacy-policy"
                                style={styles.footerLink}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                            >
                                Privacy Policy
                            </Link>
                            <a
                                href="mailto:contact@ezpresence.com"
                                style={styles.footerLink}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                            >
                                Contact
                            </a>
                        </div>
                        <p style={{ margin: 0 }}>© 2025 EZpresence. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LegalPage;
