import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-lg overflow-hidden rounded bg-[#161616] border border-neutral-800 p-6 shadow-glass animate-fade-in z-10 ${className}`}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          {title && <h3 className="text-xl font-display font-semibold text-cream-light">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded p-1 text-cream-muted hover:bg-bg-accent hover:text-cream-light transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
