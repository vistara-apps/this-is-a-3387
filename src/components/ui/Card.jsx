import React from 'react';

const Card = ({ 
  children, 
  className = '',
  onClick,
  ...props 
}) => {
  return (
    <div
      className={`glass-effect rounded-lg shadow-card hover:shadow-hover transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;