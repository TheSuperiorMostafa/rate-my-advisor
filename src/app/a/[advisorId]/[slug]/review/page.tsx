import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review/ReviewForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { User } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    advisorId: string;
    slug: string;
  }>;
}

async function getAdvisor(advisorId: string) {
  try {
    const advisor = await prisma.advisor.findUnique({
      where: { id: advisorId },
      include: {
        department: {
          include: {
            university: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!advisor) return null;

    return {
      advisor: {
        id: advisor.id,
        firstName: advisor.firstName,
        lastName: advisor.lastName,
        slug: advisor.slug,
        title: advisor.title,
        department: advisor.department,
      },
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { advisorId } = await params;
  const advisorData = await getAdvisor(advisorId);

  if (!advisorData) {
    return {
      title: "Advisor Not Found",
    };
  }

  const advisor = advisorData.advisor;
  const name = `${advisor.firstName} ${advisor.lastName}`;

  return {
    title: `Write a Review for ${name} | Rate My Advisor`,
    description: `Share your experience with ${name} at ${advisor.department.university.name}.`,
  };
}

export default async function WriteReviewPage({ params }: PageProps) {
  const { advisorId, slug } = await params;
  const advisorData = await getAdvisor(advisorId);

  if (!advisorData) {
    notFound();
  }

  const advisor = advisorData.advisor;
  const name = `${advisor.firstName} ${advisor.lastName}`;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: advisor.department.university.name,
      href: `/u/${advisor.department.university.id}/${advisor.department.university.slug}`,
    },
    {
      label: advisor.department.name,
      href: `/d/${advisor.department.id}/${advisor.department.slug}`,
    },
    {
      label: name,
      href: `/a/${advisorId}/${slug}`,
    },
    { label: "Write Review" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8 md:py-12">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F5F0FF] rounded-xl">
              <User className="w-8 h-8 text-[#5B2D8B]" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Write a Review for {name}
              </h1>
              <p className="text-lg text-gray-600">
                {advisor.title || "Academic Advisor"} • {advisor.department.name} • {advisor.department.university.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container-custom py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <ReviewForm advisorId={advisorId} advisorSlug={slug} advisorName={name} />
        </div>
      </div>
    </div>
  );
}
