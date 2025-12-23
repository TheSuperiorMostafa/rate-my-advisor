import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvisorCardProps {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  title?: string | null;
  reviewCount: number;
  overallRating?: number;
  className?: string;
}

export function AdvisorCard({
  id,
  firstName,
  lastName,
  slug,
  title,
  reviewCount,
  overallRating,
  className,
}: AdvisorCardProps) {
  const name = `${firstName} ${lastName}`;
  const href = `/a/${id}/${slug}`;

  return (
    <Link href={href} className={cn("block", className)}>
      <Card variant="interactive" className="group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#5B2D8B] transition-colors">
              {name}
            </h3>
            {title && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-1">{title}</p>
            )}
            <div className="flex items-center gap-4">
              {overallRating !== undefined && overallRating > 0 ? (
                <div className="flex items-center gap-2">
                  <StarRating rating={overallRating} size="sm" showValue />
                  <span className="text-sm text-gray-500">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#5B2D8B] transition-colors flex-shrink-0" />
        </div>
      </Card>
    </Link>
  );
}
