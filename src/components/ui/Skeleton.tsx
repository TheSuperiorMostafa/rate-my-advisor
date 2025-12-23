import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  lines?: number;
}

export function Skeleton({ className, variant = "rectangular", lines = 1, ...props }: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gray-200 rounded";

  const variants = {
    text: "h-4",
    circular: "rounded-full aspect-square",
    rectangular: "h-20",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseStyles,
              variants.text,
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
}

// Card Skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white border border-gray-200 rounded-xl p-6", className)}>
      <Skeleton variant="text" lines={2} className="mb-4" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  );
}

// Review Card Skeleton
export function ReviewCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton variant="text" className="w-24 h-5" />
          <Skeleton variant="circular" className="w-16 h-16" />
        </div>
        <Skeleton variant="text" className="w-20 h-4" />
      </div>
      <Skeleton variant="text" lines={3} />
      <div className="flex gap-2">
        <Skeleton variant="text" className="w-16 h-6 rounded-full" />
        <Skeleton variant="text" className="w-20 h-6 rounded-full" />
      </div>
    </div>
  );
}

