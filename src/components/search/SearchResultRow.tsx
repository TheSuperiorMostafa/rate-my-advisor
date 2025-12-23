import Link from "next/link";
import { GraduationCap, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultRowProps {
  type: "university" | "department" | "advisor";
  id: string;
  name: string;
  slug: string;
  secondaryLabel?: string;
  href: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const typeIcons = {
  university: GraduationCap,
  department: Building2,
  advisor: User,
};

const typeColors = {
  university: "text-[#5B2D8B]",
  department: "text-blue-600",
  advisor: "text-teal-600",
};

export function SearchResultRow({
  type,
  name,
  secondaryLabel,
  href,
  isSelected = false,
  onClick,
}: SearchResultRowProps) {
  const Icon = typeIcons[type];

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors",
        "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-1",
        isSelected && "bg-gray-50 ring-2 ring-[#A78BFA] ring-offset-1"
      )}
      role="option"
      aria-selected={isSelected}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", typeColors[type])} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{name}</div>
        {secondaryLabel && (
          <div className="text-sm text-gray-500 truncate">{secondaryLabel}</div>
        )}
      </div>
    </Link>
  );
}


