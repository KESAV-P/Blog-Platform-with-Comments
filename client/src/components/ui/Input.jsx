import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      className = '',
      textarea = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputStyle = `w-full bg-bg-input text-cream border rounded px-4 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-amber/30 ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : 'border-neutral-800 focus:border-amber focus:ring-amber/20'
    } ${className}`;

    return (
      <div className="w-full mb-4">
        {label && (
          <label className="block text-cream-muted text-sm font-medium mb-1.5">
            {label}
          </label>
        )}
        {textarea ? (
          <textarea
            ref={ref}
            rows={rows}
            className={inputStyle}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            className={inputStyle}
            {...props}
          />
        )}
        {error && (
          <span className="text-red-500 text-xs mt-1 block">
            {error.message || error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
