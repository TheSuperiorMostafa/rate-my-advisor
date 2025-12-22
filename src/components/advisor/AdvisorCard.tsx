import Link from "next/link";

interface AdvisorCardProps {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  title?: string | null;
  reviewCount: number;
  overallRating?: number;
}

export function AdvisorCard({
  id,
  firstName,
  lastName,
  slug,
  title,
  reviewCount,
  overallRating,
}: AdvisorCardProps) {
  const name = `${firstName} ${lastName}`;
  const href = `/a/${id}/${slug}`;

  return (
    <Link
      href={href}
      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          {title && <p className="text-sm text-gray-600 mt-1">{title}</p>}
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            {overallRating ? (
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-900">{overallRating.toFixed(1)}</span>
                <span className="text-yellow-400">★</span>
                <span className="text-gray-400">({reviewCount})</span>
              </div>
            ) : (
              <span>{reviewCount} {reviewCount === 1 ? "review" : "reviews"}</span>
            )}
          </div>
        </div>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

