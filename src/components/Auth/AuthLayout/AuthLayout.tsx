import React from 'react';
import { styles } from './styles';
import { Link } from 'react-router-dom';
import SocialsBackground from '@components/Background/SocialsBackground';

const AuthLayout: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, children, footer }) => {
  return (
    <div style={styles.shell}>
      <SocialsBackground />
      <div style={styles.header}>
        <Link to="/" style={styles.brand}>
          EZpresence
        </Link>
      </div>
      <div style={styles.centerPane}>
        <div style={styles.card}>
          <h1 style={styles.title}>{title}</h1>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          <div style={styles.formArea}>{children}</div>
          {footer && <div style={styles.footer}>{footer}</div>}
        </div>
      </div>
      <div style={styles.imagePane}>
        <img
          src="/icons/login-image.png"
          alt="Auth illustration"
          style={styles.heroImg}
        />
      </div>
    </div>
  );
};

export default AuthLayout;
