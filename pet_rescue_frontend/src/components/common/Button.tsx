import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  let variantStyle = "";

  switch (variant) {
    case 'primary':
      variantStyle = "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400 shadow-md shadow-orange-500/20";
      break;
    case 'secondary':
      variantStyle = "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300";
      break;
    case 'danger':
      variantStyle = "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400";
      break;
    case 'success':
      variantStyle = "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-400";
      break;
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
