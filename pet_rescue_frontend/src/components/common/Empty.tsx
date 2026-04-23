import React from 'react';

interface EmptyProps {
  message?: string;
  emoji?: string;
}

// Empty state placeholder for lists
function Empty({ message = 'Nothing here yet.', emoji = '🐾' }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-stone-400 gap-3">
      <span className="text-5xl">{emoji}</span>
      <p className="text-base font-medium">{message}</p>
    </div>
  );
}

export default Empty;
