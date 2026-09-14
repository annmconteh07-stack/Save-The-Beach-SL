import { PrismaClient, Role, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@savethebeach.sl" },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: "Mariama Kamara",
        email: "admin@savethebeach.sl",
        passwordHash: await bcrypt.hash("admin123", 12),
        role: Role.ADMIN,
      },
    });
  }

  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: "Lumley Beach sunrise clean-up",
          description: "Start the morning with a shoreline sweep and a community breakfast afterwards.",
          date: new Date("2026-10-06T07:00:00.000Z"),
          location: "Lumley Beach, Freetown",
          capacityLimit: 60,
        },
        {
          title: "Tokeh shores community day",
          description: "A family-friendly cleanup and education day with local schools and households.",
          date: new Date("2026-10-20T08:00:00.000Z"),
          location: "Tokeh Beach, Western Area",
          capacityLimit: 40,
        },
      ],
    });
  }

  const postCount = await prisma.post.count();
  if (postCount === 0) {
    const contributor = await prisma.user.upsert({
      where: { email: "contributor@savethebeach.sl" },
      update: {},
      create: {
        name: "Aminata Conteh",
        email: "contributor@savethebeach.sl",
        passwordHash: await bcrypt.hash("password123", 12),
        role: Role.CONTRIBUTOR,
      },
    });

    await prisma.post.create({
      data: {
        title: "What the tide leaves behind",
        body: "After every storm, the shoreline tells a story. Bottle caps, wrappers, and fragments of packaging reappear like a chorus of habits we haven’t yet changed.",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        status: PostStatus.APPROVED,
        authorId: contributor.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
