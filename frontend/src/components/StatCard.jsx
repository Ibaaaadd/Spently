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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`${colorClasses[color]} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
