import { TagPills } from "@/components/ui/TagPills";

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

const timeframeLabels: Record<string, string> = {
  last_6_months: "Last 6 months",
  "6_12_months": "6-12 months ago",
  "1_2_years": "1-2 years ago",
  "2_plus_years": "2+ years ago",
};

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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${
                  star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm font-medium text-gray-700">
              {averageRating.toFixed(1)}
            </span>
          </div>
          {isVerified && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              ✓ Verified Student
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">{formatDate(createdAt)}</span>
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{text}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
        <span>
          <span className="font-medium">Meeting:</span> {meetingTypeLabels[meetingType] || meetingType}
        </span>
        <span>
          <span className="font-medium">Timeframe:</span> {timeframeLabels[timeframe] || timeframe}
        </span>
        {helpfulCount > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {helpfulCount} {helpfulCount === 1 ? "person" : "people"} found this helpful
          </span>
        )}
      </div>

      {tags.length > 0 && <TagPills tags={tags} />}
    </div>
  );
}

