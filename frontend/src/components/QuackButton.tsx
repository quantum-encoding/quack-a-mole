import React from 'react';

interface QuackButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'normal' | 'quantum' | 'emergency';
}

export const QuackButton: React.FC<QuackButtonProps> = ({ 
  onClick, 
  disabled = false, 
  variant = 'normal' 
}) => {
  const getButtonStyle = () => {
    switch(variant) {
      case 'quantum':
        return {
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          color: 'white',
          fontSize: '20px',
          padding: '15px 30px',
          border: 'none',
          borderRadius: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          animation: 'quantum-pulse 2s infinite'
        };
      case 'emergency':
        return {
          background: '#FF0000',
          color: 'white',
          fontSize: '24px',
          padding: '20px 40px',
          border: '3px solid #8B0000',
          borderRadius: '15px',
          cursor: 'pointer',
          animation: 'emergency-flash 0.5s infinite'
        };
      default:
        return {
          background: '#4CAF50',
          color: 'white',
          fontSize: '16px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1
        };
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={getButtonStyle()}
      className="quack-button"
    >
      {variant === 'quantum' ? '🦆 QUANTUM QUACK 🌀' : 
       variant === 'emergency' ? '🚨 EMERGENCY QUACK 🚨' : 
       '🦆 QUACK'}
    </button>
  );
};