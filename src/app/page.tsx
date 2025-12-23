import { AutocompleteSearch } from "@/components/search/AutocompleteSearch";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Search, Star, Shield } from "lucide-react";
import { UniversityCard } from "@/components/university/UniversityCard";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container-custom section-padding">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#F5F0FF] rounded-2xl">
              <GraduationCap className="w-12 h-12 text-[#5B2D8B]" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Find Your Perfect
            <span className="text-[#5B2D8B]"> Academic Advisor</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Read honest reviews from students. Make informed decisions about your academic journey.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <AutocompleteSearch
              placeholder="Search a university, department, or advisor..."
              size="lg"
              autoFocus
              helperText="Start with your university for best results."
            />
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Student-Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#5B2D8B]" />
              <span>Nationwide Coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white border-y border-gray-200 section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get the information you need to choose the right advisor in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Search",
                description: "Find your university, department, or advisor by name",
                icon: Search,
              },
              {
                step: "2",
                title: "Read Reviews",
                description: "Browse detailed ratings and honest student feedback",
                icon: Star,
              },
              {
                step: "3",
                title: "Share Your Experience",
                description: "Help others by writing your own review",
                icon: GraduationCap,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} variant="elevated" className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-[#F5F0FF] rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[#5B2D8B]" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#5B2D8B] mb-2">{item.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Universities */}
      {universities.length > 0 && (
        <section className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Universities
            </h2>
            <p className="text-lg text-gray-600">
              Explore advisors across top universities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {universities.map((university: any) => (
              <UniversityCard
                key={university.id}
                id={university.id}
                name={university.name}
                slug={university.slug}
                location={university.location}
                departmentCount={university._count?.departments || 0}
              />
            ))}
          </div>

          {universities.length >= 6 && (
            <div className="text-center mt-12">
              <Link href="/search">
                <Button variant="outline" size="lg">
                  View All Universities
                </Button>
              </Link>
            </div>
          )}
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-[#5B2D8B] text-white section-padding">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Advisor?
          </h2>
          <p className="text-xl text-[#F5F0FF] mb-8">
            Start searching now or share your experience to help other students
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AutocompleteSearch
              placeholder="Search a university, department, or advisor..."
              size="lg"
              className="max-w-md mx-auto sm:mx-0"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
