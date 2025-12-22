import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdvisorCard } from "@/components/advisor/AdvisorCard";
import { SearchBar } from "@/components/ui/SearchBar";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    departmentId: string;
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getDepartment(departmentId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/departments/${departmentId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getAdvisors(departmentId: string, query?: string) {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/departments/${departmentId}/advisors`
    );
    if (query) url.searchParams.set("query", query);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return { advisors: [], pagination: { total: 0 } };
    const data = await res.json();
    return data.data;
  } catch {
    return { advisors: [], pagination: { total: 0 } };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { departmentId } = await params;
  const department = await getDepartment(departmentId);

  if (!department) {
    return {
      title: "Department Not Found",
    };
  }

  return {
    title: `${department.name} - ${department.university.name} | Rate My Advisor`,
    description: `Browse advisors in ${department.name} at ${department.university.name}. Read student reviews and ratings.`,
  };
}

export default async function DepartmentPage({ params, searchParams }: PageProps) {
  const { departmentId } = await params;
  const { query } = await searchParams;
  const searchQuery = typeof query === "string" ? query : "";

  const department = await getDepartment(departmentId);
  if (!department) {
    notFound();
  }

  const advisorsData = await getAdvisors(departmentId, searchQuery);
  const advisors = advisorsData.advisors || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/u/${department.university.id}/${department.university.slug}`}
              className="hover:text-gray-700"
            >
              {department.university.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{department.name}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{department.name}</h1>
          <p className="text-lg text-gray-600 mb-6">{department.university.name}</p>

          <div className="mb-6">
            <SearchBar
              placeholder="Search advisors..."
              initialValue={searchQuery}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Advisors ({advisorsData.pagination?.total || advisors.length})
        </h2>

        {advisors.length > 0 ? (
          <div className="space-y-4">
            {advisors.map((advisor: any) => (
              <AdvisorCard
                key={advisor.id}
                id={advisor.id}
                firstName={advisor.firstName}
                lastName={advisor.lastName}
                slug={advisor.slug}
                title={advisor.title}
                reviewCount={advisor._count?.reviews || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">
              {searchQuery
                ? `No advisors found matching "${searchQuery}"`
                : "No advisors found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

