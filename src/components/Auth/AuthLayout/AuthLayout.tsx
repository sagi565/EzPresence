import React from 'react';
import { styles } from './styles';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const AuthLayout: React.FC<Props> = ({ title, subtitle, children, footer }) => {
  return (
    <div style={styles.shell}>
      <div style={styles.leftPane}>
        <div style={styles.card}>
          <h1 style={styles.title}>{title}</h1>
          {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}
          <div style={styles.formArea}>{children}</div>
          {footer ? <div style={styles.footer}>{footer}</div> : null}
        </div>
      </div>

      {/* Right illustration fills full height */}
      <div style={styles.rightPane}>
        <img
          src="/icons/login-image.png"
          alt="Authentication illustration"
          style={styles.heroImg}
        />
      </div>
    </div>
  );
};

export default AuthLayout;
