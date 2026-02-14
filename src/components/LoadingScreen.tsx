import React from 'react';

const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            gap: '20px',
            background: 'linear-gradient(135deg, #f9fafb 0%, rgba(155, 93, 229, 0.03) 50%, #f9fafb 100%)',
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(155, 93, 229, 0.2)',
                borderTopColor: '#9b5de5',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: 500 }}>
                {message}
            </p>
        </div>
    );
};

export default LoadingScreen;
