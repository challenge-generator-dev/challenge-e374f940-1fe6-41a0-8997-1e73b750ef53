import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div 
      role="alert"
      className={`error-message-container ${className}`}
      style={{
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#991b1b',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        alignItems: 'flex-start'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Error</span>
      </div>
      
      <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          aria-label="Reintentar"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};