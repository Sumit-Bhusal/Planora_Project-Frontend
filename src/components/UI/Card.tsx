import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false 
}) => {
  const baseClasses = 'rounded-xl transition-all duration-200';
  
  const variants = {
    default: 'bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-border-primary shadow-sm',
    glass: 'bg-white/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm border border-white/20 dark:border-dark-border-primary/20 shadow-lg',
    gradient: 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-bg-tertiary dark:to-dark-bg-quaternary border border-primary-100 dark:border-dark-border-primary',
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : '';

  return (
    <div className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;