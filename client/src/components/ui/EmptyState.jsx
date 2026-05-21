import React from 'react';
import { FileText } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FileText,
  title = 'No items found',
  message = 'Check back later or try creating a new entry.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 my-6 bg-neutral-900/30 rounded border border-neutral-800/40">
      <div className="p-4 bg-neutral-900 rounded-full border border-neutral-800 text-cream-muted mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-display font-medium text-cream-light mb-1">{title}</h3>
      <p className="text-cream-muted text-sm max-w-sm mb-6 leading-relaxed">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
