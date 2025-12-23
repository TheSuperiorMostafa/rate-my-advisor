import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper function to get random element from array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random number between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random boolean
function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (in reverse order of dependencies)
  console.log("🧹 Clearing existing data...");
  await prisma.reviewTag.deleteMany();
  await prisma.reviewRating.deleteMany();
  await prisma.reviewVote.deleteMany();
  await prisma.reviewReport.deleteMany();
  await prisma.emailVerification.deleteMany();
  await prisma.adminAction.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.advisor.deleteMany();
  await prisma.department.deleteMany();
  await prisma.university.deleteMany();
  await prisma.user.deleteMany();

  // Create Tags
  console.log("📝 Creating tags...");
  const tagData = [
    { name: "Responsive", slug: "responsive" },
    { name: "Knowledgeable", slug: "knowledgeable" },
    { name: "Helpful", slug: "helpful" },
    { name: "Hard to Reach", slug: "hard-to-reach" },
    { name: "Supportive", slug: "supportive" },
    { name: "Clear Communication", slug: "clear-communication" },
    { name: "Disorganized", slug: "disorganized" },
    { name: "Advocates for Students", slug: "advocates-for-students" },
    { name: "Slow Response", slug: "slow-response" },
    { name: "Well-Organized", slug: "well-organized" },
    { name: "Accessible", slug: "accessible" },
    { name: "Unclear Instructions", slug: "unclear-instructions" },
  ];

  const tags = await Promise.all(
    tagData.map((tag) =>
      prisma.tag.create({
        data: tag,
      })
    )
  );
  console.log(`✅ Created ${tags.length} tags`);

  // Create Universities
  console.log("🏛️  Creating universities...");
  const universities = await Promise.all([
    prisma.university.create({
      data: {
        name: "Massachusetts Institute of Technology",
        slug: "massachusetts-institute-of-technology",
        location: "Cambridge, MA",
      },
    }),
    prisma.university.create({
      data: {
        name: "Stanford University",
        slug: "stanford-university",
        location: "Stanford, CA",
      },
    }),
    prisma.university.create({
      data: {
        name: "University of California, Berkeley",
        slug: "university-of-california-berkeley",
        location: "Berkeley, CA",
      },
    }),
  ]);
  console.log(`✅ Created ${universities.length} universities`);

  // Create Departments
  console.log("📚 Creating departments...");
  const departmentData = [
    // MIT
    { universityIndex: 0, name: "Computer Science", slug: "computer-science" },
    { universityIndex: 0, name: "Electrical Engineering", slug: "electrical-engineering" },
    { universityIndex: 0, name: "Mechanical Engineering", slug: "mechanical-engineering" },
    // Stanford
    { universityIndex: 1, name: "Computer Science", slug: "computer-science" },
    { universityIndex: 1, name: "Business", slug: "business" },
    { universityIndex: 1, name: "Psychology", slug: "psychology" },
    // UC Berkeley
    { universityIndex: 2, name: "Computer Science", slug: "computer-science" },
    { universityIndex: 2, name: "Economics", slug: "economics" },
    { universityIndex: 2, name: "Biology", slug: "biology" },
  ];

  const departments = await Promise.all(
    departmentData.map((dept) =>
      prisma.department.create({
        data: {
          universityId: universities[dept.universityIndex].id,
          name: dept.name,
          slug: dept.slug,
        },
      })
    )
  );
  console.log(`✅ Created ${departments.length} departments`);

  // Create Advisors
  console.log("👥 Creating advisors...");
  const advisorFirstNames = [
    "Sarah", "Michael", "Jennifer", "David", "Emily", "James", "Jessica",
    "Robert", "Amanda", "Christopher", "Michelle", "Daniel", "Ashley",
    "Matthew", "Nicole", "Andrew", "Stephanie", "Joshua", "Lauren", "Ryan",
  ];
  const advisorLastNames = [
    "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson",
  ];
  const advisorTitles = [
    "Senior Academic Advisor",
    "Academic Advisor",
    "Associate Academic Advisor",
    "Student Services Advisor",
    "Graduate Academic Advisor",
  ];

  const advisors = [];
  for (let i = 0; i < departments.length; i++) {
    const department = departments[i];
    for (let j = 0; j < 5; j++) {
      const firstName = randomElement(advisorFirstNames);
      const lastName = randomElement(advisorLastNames);
      const slug = createSlug(`${firstName}-${lastName}`);
      const advisor = await prisma.advisor.create({
        data: {
          departmentId: department.id,
          firstName,
          lastName,
          slug,
          title: randomElement(advisorTitles),
          isActive: randomBoolean() || j < 4, // Most are active
        },
      });
      advisors.push(advisor);
    }
  }
  console.log(`✅ Created ${advisors.length} advisors`);

  // Create Reviews
  console.log("📝 Creating reviews...");
  const meetingTypes = ["in_person", "virtual", "email", "mixed"];
  const timeframes = ["last_6_months", "6_12_months", "1_2_years", "2_plus_years"];
  const statuses = ["approved", "approved", "approved", "pending"]; // 75% approved, 25% pending
  const categories = ["accuracy", "responsiveness", "helpfulness", "availability", "advocacy", "clarity"];

  const reviewTexts = [
    "Dr. {name} was incredibly helpful in guiding me through my course selection. They took the time to understand my career goals and recommended classes that aligned perfectly with my interests. Always responded to emails within 24 hours.",
    "I found {name} to be knowledgeable about the department requirements and very clear in explaining the graduation requirements. However, scheduling meetings was sometimes difficult due to limited availability.",
    "Excellent advisor who really advocates for students. {name} helped me navigate a difficult situation with a course conflict and worked with the department to find a solution. Highly recommend!",
    "While {name} is friendly, I sometimes felt that the advice given was generic and not tailored to my specific situation. Response times were also slower than expected, sometimes taking a week to reply.",
    "Very organized and professional. {name} provided clear timelines for important deadlines and helped me plan my academic path effectively. The virtual meetings were convenient and well-structured.",
    "I had a mixed experience with {name}. They were helpful when available, but it was often hard to get an appointment. When we did meet, the advice was good, but the lack of availability was frustrating.",
    "Outstanding support throughout my time at the university. {name} went above and beyond to help me understand my options and make informed decisions. Always prepared and professional.",
    "The advisor was difficult to reach and often didn't respond to emails. When we did connect, the information provided was accurate but the communication could have been clearer.",
    "Great advisor who really cares about student success. {name} helped me explore different career paths and connected me with relevant resources. Very responsive and approachable.",
    "I appreciated {name}'s expertise, but found the advising sessions to be somewhat rushed. Would have liked more time to discuss my questions in depth.",
  ];

  let reviewCount = 0;
  for (const advisor of advisors) {
    const numReviews = randomInt(2, 5);
    const advisorName = `${advisor.firstName} ${advisor.lastName}`;

    for (let i = 0; i < numReviews; i++) {
      const status = randomElement(statuses);
      const meetingType = randomElement(meetingTypes);
      const timeframe = randomElement(timeframes);
      const reviewText = randomElement(reviewTexts).replace("{name}", advisorName);

      // Create review
      const review = await prisma.review.create({
        data: {
          advisorId: advisor.id,
          userId: null, // All anonymous for seed
          text: reviewText,
          meetingType,
          timeframe,
          status,
          isVerified: randomBoolean() && status === "approved", // Some verified
          helpfulCount: status === "approved" ? randomInt(0, 15) : 0,
          reviewedAt: status === "approved" ? new Date() : null,
        },
      });

      // Create ratings for all 6 categories
      const ratingValues = [];
      // Generate somewhat correlated ratings (good advisors are good across categories)
      const baseRating = randomInt(2, 5); // Base quality level
      for (const category of categories) {
        // Ratings vary by ±1 from base, but stay in 1-5 range
        const rating = Math.max(1, Math.min(5, baseRating + randomInt(-1, 1)));
        ratingValues.push({ category, rating });
      }

      await Promise.all(
        ratingValues.map((rv) =>
          prisma.reviewRating.create({
            data: {
              reviewId: review.id,
              category: rv.category,
              rating: rv.rating,
            },
          })
        )
      );

      // Assign 1-3 random tags
      const numTags = randomInt(1, 3);
      const selectedTags = tags
        .sort(() => Math.random() - 0.5)
        .slice(0, numTags);

      await Promise.all(
        selectedTags.map((tag) =>
          prisma.reviewTag.create({
            data: {
              reviewId: review.id,
              tagId: tag.id,
            },
          })
        )
      );

      reviewCount++;
    }
  }
  console.log(`✅ Created ${reviewCount} reviews with ratings and tags`);

  // Create some helpful votes on approved reviews
  console.log("👍 Creating helpful votes...");
  const approvedReviews = await prisma.review.findMany({
    where: { status: "approved" },
    take: 20, // Add votes to first 20 approved reviews
  });

  for (const review of approvedReviews) {
    const numVotes = randomInt(2, 8);
    for (let i = 0; i < numVotes; i++) {
      try {
        await prisma.reviewVote.create({
          data: {
            reviewId: review.id,
            userId: null, // Anonymous votes
            ipAddress: `192.168.1.${randomInt(1, 255)}`, // Fake IPs
            userAgent: "Mozilla/5.0 (seed data)",
          },
        });
      } catch (e) {
        // Ignore duplicate IP constraint errors
      }
    }
  }
  console.log(`✅ Created helpful votes`);

  // Summary
  const summary = await prisma.$transaction([
    prisma.university.count(),
    prisma.department.count(),
    prisma.advisor.count(),
    prisma.review.count(),
    prisma.tag.count(),
    prisma.reviewRating.count(),
  ]);

  console.log("\n✨ Seed completed successfully!");
  console.log("📊 Summary:");
  console.log(`   Universities: ${summary[0]}`);
  console.log(`   Departments: ${summary[1]}`);
  console.log(`   Advisors: ${summary[2]}`);
  console.log(`   Reviews: ${summary[3]}`);
  console.log(`   Tags: ${summary[4]}`);
  console.log(`   Ratings: ${summary[5]}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


