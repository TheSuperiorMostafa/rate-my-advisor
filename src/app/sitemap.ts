import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
  
  // Dynamic import to avoid issues if prisma not available
  let universities: any[] = [];
  let advisors: any[] = [];
  
  try {
    const { prisma } = await import('@/lib/prisma');
    
    // Get all universities
    universities = await prisma.university.findMany({
      select: { id: true, slug: true, updatedAt: true },
    });

    // Get all advisors (limit to most recent for performance)
    advisors = await prisma.advisor.findMany({
      where: { isActive: true },
      select: { id: true, slug: true, updatedAt: true },
      take: 1000, // Limit for performance
      orderBy: { updatedAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  const universityPages: MetadataRoute.Sitemap = universities.map((uni) => ({
    url: `${baseUrl}/u/${uni.id}/${uni.slug}`,
    lastModified: uni.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const advisorPages: MetadataRoute.Sitemap = advisors.map((advisor) => ({
    url: `${baseUrl}/a/${advisor.id}/${advisor.slug}`,
    lastModified: advisor.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...universityPages, ...advisorPages];
}

