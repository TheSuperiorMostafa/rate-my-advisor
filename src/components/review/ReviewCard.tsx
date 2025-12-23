import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { TagPills } from "@/components/ui/TagPills";
import { Badge } from "@/components/ui/Badge";
import { ThumbsUp, Calendar, Video, Mail, Users, MessageSquare, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  id: string;
  text: string;
  meetingType: string;
  timeframe: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  ratings: Record<string, number>;
  tags: Array<{ id: string; name: string; slug: string }>;
}

const meetingTypeLabels: Record<string, string> = {
  in_person: "In-Person",
  virtual: "Virtual",
  email: "Email",
  mixed: "Mixed",
};

const meetingTypeIcons: Record<string, typeof Video> = {
  in_person: Users,
  virtual: Video,
  email: Mail,
  mixed: MessageSquare,
};

const timeframeLabels: Record<string, string> = {
  last_6_months: "Last 6 months",
  "6_12_months": "6-12 months ago",
  "1_2_years": "1-2 years ago",
  "2_plus_years": "2+ years ago",
};

// Get sentiment badge based on rating
function getSentimentBadge(rating: number) {
  if (rating >= 4.5) {
    return { label: "Excellent", variant: "success" as const };
  } else if (rating >= 4.0) {
    return { label: "Great", variant: "success" as const };
  } else if (rating >= 3.5) {
    return { label: "Good", variant: "info" as const };
  } else if (rating >= 3.0) {
    return { label: "OK", variant: "warning" as const };
  } else if (rating >= 2.0) {
    return { label: "Poor", variant: "warning" as const };
  } else {
    return { label: "Awful", variant: "error" as const };
  }
}

// Format category name for display
function formatCategoryName(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function ReviewCard({
  text,
  meetingType,
  timeframe,
  isVerified,
  helpfulCount,
  createdAt,
  ratings,
  tags,
}: ReviewCardProps) {
  const averageRating =
    Object.values(ratings).reduce((sum, rating) => sum + rating, 0) /
    Object.values(ratings).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const MeetingIcon = meetingTypeIcons[meetingType] || MessageSquare;
  const sentiment = getSentimentBadge(averageRating);

  // Get category ratings in a consistent order
  const categoryOrder = ["accuracy", "responsiveness", "helpfulness", "availability", "advocacy", "clarity"];
  const categoryRatings = categoryOrder
    .map((cat) => ({
      name: formatCategoryName(cat),
      value: ratings[cat] || 0,
    }))
    .filter((cat) => cat.value > 0);

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Top Row: Sentiment Badge + Rating + Date */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={sentiment.variant} size="md" className="font-bold text-xs px-3 py-1">
            {sentiment.label}
          </Badge>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
            <StarRating rating={averageRating} size="sm" />
          </div>
          {isVerified && (
            <Badge variant="success" size="sm" className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </Badge>
          )}
        </div>
        <time className="text-xs text-gray-500 whitespace-nowrap font-medium" dateTime={createdAt}>
          {formatDate(createdAt)}
        </time>
      </div>

      {/* Secondary Row: Category Micro-Scores */}
      {categoryRatings.length > 0 && (
        <div className="py-3 border-b border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
            {categoryRatings.map((category) => (
              <div key={category.name} className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-gray-600 truncate">{category.name}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs font-bold text-gray-900">{category.value.toFixed(1)}</span>
                  <StarRating rating={category.value} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Text */}
      <div className="py-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {text}
        </p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="pb-4 border-b border-gray-100">
          <TagPills tags={tags} size="sm" />
        </div>
      )}

      {/* Bottom Row: Metadata + Actions */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <MeetingIcon className="w-3.5 h-3.5" />
            <span className="font-medium">{meetingTypeLabels[meetingType] || meetingType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{timeframeLabels[timeframe] || timeframe}</span>
          </div>
        </div>

        {helpfulCount > 0 && (
          <div className="flex items-center gap-1.5 text-[#5B2D8B]">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs font-semibold">
              {helpfulCount} {helpfulCount === 1 ? "helpful" : "helpful"}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
