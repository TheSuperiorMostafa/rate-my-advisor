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
    { label: "Accuracy", value: accuracy },
    { label: "Responsiveness", value: responsiveness },
    { label: "Helpfulness", value: helpfulness },
    { label: "Availability", value: availability },
    { label: "Advocacy", value: advocacy },
    { label: "Clarity", value: clarity },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (totalReviews === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Overall Rating</h2>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900">{overall.toFixed(1)}</div>
            <div className="text-sm text-gray-500">{totalReviews} {totalReviews === 1 ? "review" : "reviews"}</div>
            <div className="text-xs text-gray-400 mt-1">Average of category averages</div>
          </div>
        </div>
        {renderStars(overall)}
      </div>

      {/* Rating Distribution */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Rating Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star as keyof typeof ratingDistribution];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{star}</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {count} ({percentage > 0 ? percentage.toFixed(0) : 0}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Category Breakdown</h3>
        {categories.map((category) => (
          <div key={category.label} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 w-32">{category.label}</span>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(category.value / 5) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 w-16 text-right">
              {category.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

