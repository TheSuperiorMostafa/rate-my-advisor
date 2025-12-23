import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdvisorCard } from "@/components/advisor/AdvisorCard";
import { AutocompleteSearch } from "@/components/search/AutocompleteSearch";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GraduationCap } from "lucide-react";

interface PageProps {
  params: Promise<{
    departmentId: string;
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getDepartment(departmentId: string) {
  try {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    return department;
  } catch {
    return null;
  }
}

async function getAdvisors(departmentId: string, query?: string) {
  try {
    const where = {
      departmentId,
      isActive: true,
      ...(query && {
        OR: [
          { firstName: { contains: query, mode: "insensitive" as const } },
          { lastName: { contains: query, mode: "insensitive" as const } },
        ],
      }),
    };

    const [advisors, total] = await Promise.all([
      prisma.advisor.findMany({
        where,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          slug: true,
          title: true,
          _count: {
            select: {
              reviews: {
                where: {
                  status: "approved",
                },
              },
            },
          },
        },
      }),
      prisma.advisor.count({ where }),
    ]);

    return { advisors, pagination: { total } };
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

  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: department.university.name,
      href: `/u/${department.university.id}/${department.university.slug}`,
    },
    { label: department.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                {department.name}
              </h1>
              <p className="text-lg text-gray-600">{department.university.name}</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <AutocompleteSearch
              placeholder={`Find an advisor in ${department.name}...`}
              initialValue={searchQuery}
              autoFocus
              context={{
                universityId: department.university.id,
                departmentId: department.id,
                universityName: department.university.name,
              }}
            />
          </div>
        </div>
      </div>

      {/* Advisors Section */}
      <div className="container-custom py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Advisors
            {advisorsData.pagination?.total !== undefined && (
              <span className="text-gray-500 font-normal ml-2">
                ({advisorsData.pagination.total})
              </span>
            )}
          </h2>
        </div>

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
          <Card className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? `No advisors found` : "No advisors yet"}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? `Try a different search term`
                : "Advisors will appear here once added"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
