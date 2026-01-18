import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white dark:bg-dark-card rounded-xl shadow-card border border-gray-200 dark:border-dark-border transition-colors duration-200 p-6 ${hover ? 'hover:shadow-lg dark:hover:bg-dark-cardHover' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
