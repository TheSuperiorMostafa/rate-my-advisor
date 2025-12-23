"use client";

import { useState } from "react";

interface StarRatingInputProps {
  label: string;
  value: number;
  onChange: (rating: number) => void;
  required?: boolean;
}

export function StarRatingInput({ label, value, onChange, required }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
          >
            <span
              className={`text-3xl transition-colors ${
                star <= (hovered || value)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </span>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-gray-600">{value} / 5</span>
        )}
      </div>
    </div>
  );
}


