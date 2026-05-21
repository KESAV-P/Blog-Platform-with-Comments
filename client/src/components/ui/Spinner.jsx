import React from 'react';

const Spinner = ({ size = 'md', center = true, className = '' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-amber border-r-transparent border-b-transparent border-l-transparent ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      style={{ borderColor: 'rgba(245, 158, 11, 0.1)', borderTopColor: '#f59e0b' }}
    ></div>
  );

  if (center) {
    return <div className="flex justify-center items-center py-8 w-full">{spinner}</div>;
  }

  return spinner;
};

export default Spinner;
