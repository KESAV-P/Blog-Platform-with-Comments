import React from 'react';

const Avatar = ({ src, name = 'User', size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-neutral-800 border border-neutral-700/50 select-none shrink-0 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium tracking-wider text-cream-muted">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
