import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-amber hover:bg-amber-dark text-bg-dark font-semibold border border-transparent shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary: 'bg-neutral-800 hover:bg-neutral-700 text-cream border border-neutral-700 hover:border-neutral-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent',
    outline: 'bg-transparent border border-cream-border text-cream hover:bg-bg-accent',
    ghost: 'bg-transparent text-cream hover:bg-bg-accent border border-transparent',
    link: 'bg-transparent text-amber hover:underline p-0 border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
