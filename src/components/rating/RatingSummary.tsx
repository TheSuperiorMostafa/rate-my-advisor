import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RatingSummaryProps {
  overall: number;
  accuracy: number;
  responsiveness: number;
  helpfulness: number;
  availability: number;
  advocacy: number;
  clarity: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export function RatingSummary({
  overall,
  accuracy,
  responsiveness,
  helpfulness,
  availability,
  advocacy,
  clarity,
  totalReviews,
  ratingDistribution,
}: RatingSummaryProps) {
  const categories = [
    { label: "Accuracy", value: accuracy, key: "accuracy" },
    { label: "Responsiveness", value: responsiveness, key: "responsiveness" },
    { label: "Helpfulness", value: helpfulness, key: "helpfulness" },
    { label: "Availability", value: availability, key: "availability" },
    { label: "Advocacy", value: advocacy, key: "advocacy" },
    { label: "Clarity", value: clarity, key: "clarity" },
  ];

  if (totalReviews === 0) {
    return (
      <Card variant="elevated" className="text-center py-12">
        <p className="text-gray-500 text-lg font-medium">No reviews yet</p>
        <p className="text-gray-400 text-sm mt-2">Be the first to review this advisor</p>
      </Card>
    );
  }

  // Calculate percentage for each rating
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  // Get sentiment color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-[#16A34A]";
    if (rating >= 4.0) return "text-[#5B2D8B]";
    if (rating >= 3.5) return "text-[#F59E0B]";
    if (rating >= 3.0) return "text-orange-600";
    return "text-[#DC2626]";
  };

  return (
    <div className="space-y-6">
      {/* Rating Distribution - Compact and Clean */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Rating Distribution</h3>
          <span className="text-sm text-gray-500 font-medium">{totalReviews} total</span>
        </div>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star as keyof typeof ratingDistribution];
            const percentage = getPercentage(count);
            const isHighest = count === Math.max(...Object.values(ratingDistribution));
            
            return (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-20 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-900 w-4">{star}</span>
                  <StarRating rating={star} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        isHighest
                          ? "bg-gradient-to-r from-[#A78BFA] to-[#5B2D8B]"
                          : "bg-gradient-to-r from-gray-400 to-gray-500"
                      )}
                      style={{ width: `${percentage}%` }}
                      role="progressbar"
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 w-24 justify-end flex-shrink-0">
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                  <span className="text-xs text-gray-500 w-10 text-right">
                    ({percentage > 0 ? percentage.toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Category Breakdown - Compact Grid */}
      <Card variant="elevated">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const percentage = (category.value / 5) * 100;
            const isHigh = category.value >= 4.0;
            const isLow = category.value < 3.0;
            
            return (
              <div
                key={category.key}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-[#A78BFA] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{category.label}</span>
                    {isHigh && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {isLow && <TrendingDown className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-lg font-bold", getRatingColor(category.value))}>
                      {category.value.toFixed(1)}
                    </span>
                    <StarRating rating={category.value} size="sm" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isHigh
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : isLow
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : "bg-gradient-to-r from-[#A78BFA] to-[#5B2D8B]"
                    )}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
