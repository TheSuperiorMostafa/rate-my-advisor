import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AutocompleteSearch } from "@/components/search/AutocompleteSearch";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UniversityContextSync } from "@/components/nav/UniversityContextSync";

interface PageProps {
  params: Promise<{
    universityId: string;
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getUniversity(universityId: string) {
  try {
    const university = await prisma.university.findUnique({
      where: { id: universityId },
      include: {
        departments: {
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                advisors: true,
              },
            },
          },
          orderBy: { name: "asc" },
        },
      },
    });
    return university;
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

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: university.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sync university context for nav */}
      <UniversityContextSync
        university={{
          id: university.id,
          name: university.name,
          slug: university.slug,
        }}
      />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8 md:py-12">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
          
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-[#F5F0FF] rounded-xl">
              <GraduationCap className="w-8 h-8 text-[#5B2D8B]" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {university.name}
              </h1>
              {university.location && (
                <p className="text-lg text-gray-600">{university.location}</p>
              )}
            </div>
          </div>

          <div className="max-w-2xl">
            <AutocompleteSearch
              placeholder={`Find an advisor or department at ${university.name}...`}
              initialValue={searchQuery}
              autoFocus
              context={{
                universityId: university.id,
                universityName: university.name,
              }}
            />
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <div className="container-custom py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Departments
            {departments.length > 0 && (
              <span className="text-gray-500 font-normal ml-2">
                ({departments.length})
              </span>
            )}
          </h2>
        </div>

        {departments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department: any) => (
              <Link
                key={department.id}
                href={`/d/${department.id}/${department.slug}`}
              >
                <Card variant="interactive" className="h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#5B2D8B] transition-colors">
                    {department.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>
                      {department._count?.advisors || 0}{" "}
                      {department._count?.advisors === 1 ? "advisor" : "advisors"}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? `No departments found` : "No departments yet"}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? `Try a different search term`
                : "Departments will appear here once added"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
