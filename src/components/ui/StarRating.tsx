"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

// Premium SVG Star Component
function StarIcon({
  filled,
  halfFilled,
  size,
}: {
  filled: boolean;
  halfFilled: boolean;
  size: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  // Muted gold color that looks premium (not bright yellow)
  const fillColor = filled || halfFilled ? "#D4AF37" : "#E5E7EB";
  const strokeColor = filled || halfFilled ? "#B8941F" : "#D1D5DB";

  return (
    <svg
      className={cn(sizeClasses[size], "flex-shrink-0")}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {halfFilled && (
          <linearGradient id="half-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor={fillColor} />
            <stop offset="50%" stopColor="#E5E7EB" />
          </linearGradient>
        )}
      </defs>
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={halfFilled ? "url(#half-fill)" : fillColor}
        stroke={strokeColor}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const displayRating = hoveredRating ?? rating;

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`Rating: ${rating.toFixed(1)} out of ${maxRating}`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const value = i + 1;
        const filled = value <= Math.floor(displayRating);
        const halfFilled = !filled && value - 0.5 <= displayRating && displayRating < value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => interactive && setHoveredRating(value)}
            onMouseLeave={() => interactive && setHoveredRating(null)}
            disabled={!interactive}
            className={cn(
              "transition-transform",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
            aria-label={`${value} star${value !== 1 ? "s" : ""}`}
            aria-pressed={interactive ? value === rating : undefined}
          >
            <StarIcon filled={filled} halfFilled={halfFilled} size={size} />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
