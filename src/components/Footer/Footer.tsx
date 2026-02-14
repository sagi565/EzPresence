import React from 'react';
import { Link } from 'react-router-dom';
import { styles } from './styles';

const Footer: React.FC = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.footerContent}>
                <div style={styles.footerLinks}>
                    <Link
                        to="/terms-of-service"
                        style={styles.footerLink}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                        Terms of Service
                    </Link>
                    <span style={styles.separator}>•</span>
                    <Link
                        to="/privacy-policy"
                        style={styles.footerLink}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
