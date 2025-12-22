import { SearchBar } from "@/components/ui/SearchBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rate My Advisor - Find and Review Academic Advisors",
  description: "Discover and review academic advisors at universities nationwide. Read student reviews and ratings to find the best advisor for you.",
  openGraph: {
    title: "Rate My Advisor",
    description: "Find and review academic advisors",
    type: "website",
  },
};

async function getFeaturedUniversities() {
  try {
    // Use direct Prisma query instead of API call during SSR
    const { prisma } = await import("@/lib/prisma");
    const universities = await prisma.university.findMany({
      take: 6,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });
    return universities;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const universities = await getFeaturedUniversities();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Rate My Advisor
          </h1>
          <p className="text-xl text-gray-600 text-center mb-8">
            Find and review academic advisors at universities nationwide
          </p>
          <SearchBar placeholder="Search for a university..." />
        </div>
      </div>

      {/* Featured Universities */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Universities</h2>
        {universities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((university: any) => (
              <a
                key={university.id}
                href={`/u/${university.id}/${university.slug}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {university.name}
                </h3>
                {university.location && (
                  <p className="text-sm text-gray-600 mb-2">{university.location}</p>
                )}
                <p className="text-sm text-gray-500">
                  {university._count?.departments || 0} {university._count?.departments === 1 ? "department" : "departments"}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No universities found. Seed the database to see content.</p>
          </div>
        )}
      </div>
    </div>
  );
}

