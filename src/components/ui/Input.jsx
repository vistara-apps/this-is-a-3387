import React from 'react';

const Input = ({ 
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  type = 'text',
  ...props 
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
};

export default Input;