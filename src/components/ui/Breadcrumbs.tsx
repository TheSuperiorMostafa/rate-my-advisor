import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn("flex items-center text-sm text-gray-600", className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 rounded"
                >
                  {index === 0 && <Home className="w-4 h-4 inline mr-1" aria-hidden="true" />}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "text-gray-900",
                    index === 0 && "flex items-center"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {index === 0 && <Home className="w-4 h-4 inline mr-1" aria-hidden="true" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

