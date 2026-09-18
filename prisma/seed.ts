import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Role, PostStatus, MediaType } from "../src/generated/prisma/enums";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "admin@savethebeach.sl";
const ADMIN_PASSWORD = "STBadmin@2026!";

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: "Admin",
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: Role.ADMIN,
      emailVerified: true,
      verifyToken: null,
      verifyTokenExpires: null,
    },
    create: {
      name: "Admin",
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  const contributor = await prisma.user.upsert({
    where: { email: "contributor@savethebeach.sl" },
    update: { emailVerified: true },
    create: {
      name: "Aminata Conteh",
      email: "contributor@savethebeach.sl",
      passwordHash: await bcrypt.hash("password123", 12),
      role: Role.CONTRIBUTOR,
      emailVerified: true,
    },
  });

  const contributor2 = await prisma.user.upsert({
    where: { email: "ibrahim@savethebeach.sl" },
    update: { emailVerified: true },
    create: {
      name: "Ibrahim Sesay",
      email: "ibrahim@savethebeach.sl",
      passwordHash: await bcrypt.hash("password123", 12),
      role: Role.CONTRIBUTOR,
      emailVerified: true,
    },
  });

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
        {
          title: "Hamilton shoreline sweep",
          description: "A focused cleanup around the shoreline edge and nearby drainage points.",
          date: new Date("2026-11-03T07:30:00.000Z"),
          location: "Hamilton Beach, Freetown",
          capacityLimit: 45,
        },
      ],
    });
  }

  const volunteerCount = await prisma.volunteer.count();
  if (volunteerCount === 0) {
    await prisma.volunteer.createMany({
      data: [
        { name: "Fatmata Bangura", email: "fatmata@gmail.com", phone: "+232 76 111 2222", age: 29 },
        { name: "Mohamed Kamara", email: "mohamed.k@gmail.com", phone: "+232 77 333 4444", age: 34 },
        { name: "Hawa Sesay", email: "hawa.sesay@gmail.com", phone: "+232 78 555 6666", age: 22 },
        { name: "Sorie Mansaray", email: "sorie.m@gmail.com", phone: "+232 76 777 8888", age: 41 },
      ],
    });
  }

  const postCount = await prisma.post.count();
  if (postCount === 0) {
    const post1 = await prisma.post.create({
      data: {
        title: "What the tide leaves behind",
        body: "After every storm, the shoreline tells a story. Bottle caps, wrappers, and fragments of packaging reappear like a chorus of habits we haven't yet changed.\n\nAt Save The Beach SL we pay attention to those patterns. We document what comes in with the tide, not just to record the problem, but to understand the systems behind it.",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        status: PostStatus.APPROVED,
        authorId: contributor.id,
      },
    });

    const post2 = await prisma.post.create({
      data: {
        title: "Small hands, big change",
        body: "The younger volunteers who joined our last shoreline sweep came with gloves, a sense of purpose, and more curiosity than anyone expected.\n\nThey were not just picking up trash; they were asking why it was there, how it got there, and what could be done to stop it from coming back.",
        imageUrl: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054",
        status: PostStatus.APPROVED,
        authorId: contributor2.id,
      },
    });

    const post3 = await prisma.post.create({
      data: {
        title: "From trash to togetherness",
        body: "By the end of the cleanup, the volunteers were not just tired, they were laughing and trading stories. That was when the real impact surfaced.\n\nThe beach became a place where neighbours met each other again, where people from different corners of the community found common ground.",
        status: PostStatus.APPROVED,
        authorId: admin.id,
      },
    });

    await prisma.post.create({
      data: {
        title: "Plastic-free lunches at Kroo Bay",
        body: "A new initiative to swap single-use packaging for reusable containers is starting to take shape at Kroo Bay. Local vendors are joining the conversation.",
        status: PostStatus.PENDING,
        authorId: contributor.id,
      },
    });

    await prisma.comment.createMany({
      data: [
        { body: "This is so true. I saw it myself after the last storm.", authorId: contributor2.id, postId: post1.id },
        { body: "Thank you for documenting this, it matters.", authorId: admin.id, postId: post1.id },
        { body: "Love seeing the young ones take the lead!", authorId: contributor.id, postId: post2.id },
        { body: "This is exactly why I volunteer every month.", authorId: contributor2.id, postId: post3.id },
      ],
    });
  }

  const mediaCount = await prisma.media.count();
  if (mediaCount === 0) {
    await prisma.media.createMany({
      data: [
        {
          caption: "Lumley Beach clean-up — 12 bags collected before sunrise.",
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          type: MediaType.PHOTO,
        },
        {
          caption: "Tokeh community day — kids sorting plastics with gloves on.",
          url: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=1200&q=80",
          type: MediaType.PHOTO,
        },
        {
          caption: "Hamilton shoreline sweep — before and after.",
          url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
          type: MediaType.PHOTO,
        },
        {
          caption: "Teams heading out at dawn for the beach cleanup.",
          url: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=1200&q=80",
          type: MediaType.PHOTO,
        },
      ],
    });
  }
}

main()
  .then(async () => {
    console.log("\nAdmin credentials:");
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}\n`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });