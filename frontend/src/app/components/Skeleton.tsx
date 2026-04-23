import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseStyles = "bg-secondary/50 relative overflow-hidden";
  const roundedStyles = 
    variant === 'circular' ? 'rounded-full' : 
    variant === 'rounded' ? 'rounded-2xl' : 'rounded-md';

  return (
    <div className={`${baseStyles} ${roundedStyles} ${className}`}>
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}
