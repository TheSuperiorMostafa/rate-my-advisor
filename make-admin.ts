import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx make-admin.ts <email>");
    console.error("Example: tsx make-admin.ts superiormostafa@gmail.com");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`❌ User with email ${email} not found.`);
    console.error("Make sure you've signed in at least once.");
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log(`✅ User ${updated.email} is now an ADMIN`);
  console.log(`   User ID: ${updated.id}`);
  console.log(`   Role: ${updated.role}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());


