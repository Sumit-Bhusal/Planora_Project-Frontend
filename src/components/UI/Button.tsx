import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 text-white hover:shadow-lg hover:scale-105 focus:ring-primary-500 dark:focus:ring-primary-400',
    secondary: 'bg-gradient-to-r from-accent-600 to-accent-500 dark:from-accent-500 dark:to-accent-400 text-white hover:shadow-lg hover:scale-105 focus:ring-accent-500 dark:focus:ring-accent-400',
    outline: 'border-2 border-primary-300 dark:border-dark-border-primary text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-dark-bg-tertiary hover:border-primary-400 dark:hover:border-primary-300 focus:ring-primary-500 dark:focus:ring-primary-400',
    ghost: 'text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-dark-bg-tertiary focus:ring-primary-500 dark:focus:ring-primary-400',
    danger: 'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 hover:shadow-lg focus:ring-red-500 dark:focus:ring-red-400',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? disabledClasses : ''}
        ${className}
      `}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2" />}
    </button>
  );
};

export default Button;