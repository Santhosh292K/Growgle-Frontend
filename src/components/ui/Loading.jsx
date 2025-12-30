import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ className, size = "default" }) => {
  const sizes = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center"
    >
      <Loader2 className={cn("animate-spin text-blue-600", sizes[size], className)} />
    </motion.div>
  );
};

const PageLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-grey-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-grey-600">Loading...</p>
      </div>
    </div>
  );
};

const SkeletonCard = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-white rounded-lg border border-grey-200", className)}>
      <div className="p-6">
        <div className="h-4 bg-grey-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-grey-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-grey-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export { LoadingSpinner, PageLoading, SkeletonCard };