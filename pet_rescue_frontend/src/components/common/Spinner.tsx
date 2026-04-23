import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

// Centered loading spinner
function Spinner({ size = 'md', message }: SpinnerProps) {
  const sizeClass = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizeClass} border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin`}
      />
      {message && <p className="text-stone-500 text-sm">{message}</p>}
    </div>
  );
}

export default Spinner;
