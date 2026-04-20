import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="mb-1.5 text-sm font-bold text-slate-700">{label}</label>}
      <input
        className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-sm"
        {...props}
      />
    </div>
  );
};

export default Input;
