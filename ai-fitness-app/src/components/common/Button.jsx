import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  icon = null,
  fullWidth = false,
  type = 'button'
}) => {
  // Map our variants to Material UI variants
  const muiVariant = variant === 'outline' ? 'outlined' : 'contained';
  const muiColor = {
    primary: 'primary',
    secondary: 'secondary',
    danger: 'error',
    outline: 'primary',
    text: 'primary'
  }[variant] || 'primary';
  
  return (
    <MuiButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      variant={variant === 'text' ? 'text' : muiVariant}
      color={muiColor}
      className={className}
      startIcon={icon}
    >
      {children}
    </MuiButton>
  );
};

export default Button;