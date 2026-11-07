import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  small: 24,
  medium: 40,
  large: 64
};

const messageSizeMap = {
  small: '0.75rem',
  medium: '0.875rem',
  large: '1rem'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message,
  className = '',
  fullScreen = false 
}) => {
  const spinnerSize = sizeMap[size];
  const fontSize = messageSizeMap[size];
  
  const containerStyle: React.CSSProperties = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999,
    gap: '1rem'
  } : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    gap: '1rem'
  };
  
  const spinnerStyle: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: '3px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  };
  
  return (
    <div 
      className={`loading-spinner-container ${className}`}
      style={containerStyle}
      role="status"
      aria-live="polite"
      aria-label={message || 'Cargando...'}
    >
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      
      <div 
        style={spinnerStyle}
        aria-hidden="true"
      />
      
      {message && (
        <span style={{ 
          color: '#6b7280', 
          fontSize,
          fontWeight: 500 
        }}>
          {message}
        </span>
      )}
      
      <span className="sr-only" style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
      }}>
        {message || 'Cargando contenido'}
      </span>
    </div>
  );
};

// Componente auxiliar para estados de carga inline
interface InlineLoadingProps {
  text?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ 
  text = 'Cargando...' 
}) => (
  <span 
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#6b7280',
      fontSize: '0.875rem'
    }}
    role="status"
    aria-label={text}
  >
    <span 
      style={{
        width: '12px',
        height: '12px',
        border: '2px solid #e5e7eb',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}
      aria-hidden="true"
    />
    {text}
    <style>
      {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </span>
);