import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'outline';
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  className = "", 
  ...props 
}) => {
  const base = "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    primary: "bg-[#d94e28] text-white shadow-[0_0_20px_rgba(217,78,40,0.3)] hover:shadow-[0_0_30px_rgba(217,78,40,0.5)] hover:bg-[#bf4322]",
    secondary: "bg-white text-black hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
    glass: "glass-panel text-white hover:bg-white/10",
    ghost: "text-white/60 hover:text-white",
    outline: "border border-white/20 text-white hover:bg-white/5"
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
