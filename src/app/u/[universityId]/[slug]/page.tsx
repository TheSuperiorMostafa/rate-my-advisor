import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    universityId: string;
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getUniversity(universityId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/universities/${universityId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { universityId } = await params;
  const university = await getUniversity(universityId);

  if (!university) {
    return {
      title: "University Not Found",
    };
  }

  return {
    title: `${university.name} - Rate My Advisor`,
    description: `Browse departments and advisors at ${university.name}. Read student reviews and ratings.`,
    openGraph: {
      title: `${university.name} - Rate My Advisor`,
      description: `Browse departments and advisors at ${university.name}`,
    },
  };
}

export default async function UniversityPage({ params, searchParams }: PageProps) {
  const { universityId } = await params;
  const { query } = await searchParams;
  const searchQuery = typeof query === "string" ? query : "";

  const university = await getUniversity(universityId);

  if (!university) {
    notFound();
  }

  // Filter departments if search query provided
  const departments = searchQuery
    ? university.departments.filter((dept: any) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : university.departments;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-gray-700">
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{university.name}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{university.name}</h1>
          {university.location && (
            <p className="text-lg text-gray-600 mb-6">{university.location}</p>
          )}

          <div className="mb-6">
            <SearchBar
              placeholder="Search departments..."
              initialValue={searchQuery}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Departments ({departments.length})
        </h2>

        {departments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department: any) => (
              <Link
                key={department.id}
                href={`/d/${department.id}/${department.slug}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {department.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {department._count?.advisors || 0} {department._count?.advisors === 1 ? "advisor" : "advisors"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">
              {searchQuery
                ? `No departments found matching "${searchQuery}"`
                : "No departments found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

