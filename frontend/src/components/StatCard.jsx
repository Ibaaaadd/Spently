import React from 'react';
import Card from './Card';

const StatCard = ({ icon: Icon, label, value, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-green-500',
    danger: 'text-red-500',
    warning: 'text-yellow-500',
  };

  return (
    <Card hover>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-1 truncate">{label}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white break-words">{value}</p>
        </div>
        <div className={`${colorClasses[color]} bg-opacity-10 p-2 sm:p-3 rounded-lg flex-shrink-0`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
