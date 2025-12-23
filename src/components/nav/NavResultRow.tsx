import Link from "next/link";
import { GraduationCap, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavResultRowProps {
  type: "university" | "department" | "advisor";
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  href: string;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
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

export function NavResultRow({
  type,
  name,
  subtitle,
  href,
  isSelected = false,
  onClick,
}: NavResultRowProps) {
  const Icon = typeIcons[type];

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
      className={cn(
        "flex items-start gap-2.5 p-2.5 rounded-md transition-colors",
        "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-1",
        isSelected && "bg-gray-50 ring-2 ring-[#A78BFA] ring-offset-1"
      )}
      role="option"
      aria-selected={isSelected}
    >
      <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", typeColors[type])} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">{name}</div>
        {subtitle && (
          <div className="text-xs text-gray-500 truncate mt-0.5">{subtitle}</div>
        )}
      </div>
    </Link>
  );
}

