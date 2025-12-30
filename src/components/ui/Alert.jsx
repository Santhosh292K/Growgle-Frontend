import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  className,
  onClose,
  ...props 
}) => {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600'
    }
  };

  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'rounded-lg border p-4',
        variant.bg,
        variant.border,
        className
      )}
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', variant.iconColor)} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium', variant.text)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', variant.text, title && 'mt-1')}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={cn(
                'inline-flex rounded-md p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
                variant.iconColor,
                'hover:bg-black/5'
              )}
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export { Alert };