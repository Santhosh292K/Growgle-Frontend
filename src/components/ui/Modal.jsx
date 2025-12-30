import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  size = 'default',
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn(
            'relative w-full bg-white rounded-xl shadow-xl',
            sizes[size],
            className
          )}
          {...props}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-grey-200">
              <h2 className="text-lg font-semibold text-grey-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-grey-400 hover:text-grey-600 hover:bg-grey-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { Modal };