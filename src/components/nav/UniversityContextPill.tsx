"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UniversityContextPillProps {
  universityName: string;
  onClear: () => void;
  className?: string;
}

export function UniversityContextPill({
  universityName,
  onClear,
  className,
}: UniversityContextPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-[#F5F0FF] border border-[#A78BFA]",
        "text-sm font-medium text-[#5B2D8B]",
        className
      )}
    >
      <span className="truncate max-w-[200px]">{universityName}</span>
      <button
        onClick={onClear}
        className="flex-shrink-0 p-0.5 hover:bg-[#A78BFA]/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-1"
        aria-label="Clear selected university"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}


