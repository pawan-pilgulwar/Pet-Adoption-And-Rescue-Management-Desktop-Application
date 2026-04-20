import React from 'react';

const Spinner: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-sm text-stone-400">{text}</p>
  </div>
);

export default Spinner;
