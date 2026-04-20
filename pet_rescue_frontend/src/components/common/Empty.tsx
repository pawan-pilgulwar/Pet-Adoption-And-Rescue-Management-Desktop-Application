import React from 'react';

interface Props { icon?: string; text?: string; action?: React.ReactNode; }

const Empty: React.FC<Props> = ({ icon = '📭', text = 'Nothing here yet.', action }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border border-stone-100">
    <span className="text-4xl">{icon}</span>
    <p className="text-sm text-stone-400 font-medium">{text}</p>
    {action}
  </div>
);

export default Empty;
