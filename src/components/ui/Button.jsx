import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  asChild = false, 
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:shadow-sm",
    secondary: "bg-grey-100 text-grey-900 hover:bg-grey-200 border border-grey-300",
    outlined: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700",
    ghost: "text-grey-700 hover:bg-grey-100 hover:text-grey-900",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export { Button };