import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`card p-6 ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
