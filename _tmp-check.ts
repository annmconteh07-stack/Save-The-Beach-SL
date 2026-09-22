import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "C:/Users/Pikin Welbodi Centre/Save-The-Beach-SL/src/generated/prisma/client";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const prisma = new PrismaClient({ adapter });

  const events = await prisma.event.findMany();
  console.log("EVENTS:", JSON.stringify(events.map((e) => ({ id: e.id, title: e.title, date: e.date })), null, 2));

  const registrations = await prisma.registration.count();
  const volunteers = await prisma.volunteer.count();
  const posts = await prisma.post.count();
  const comments = await prisma.comment.count();
  const stats = await prisma.siteStat.count();
  console.log(`registrations=${registrations} volunteers=${volunteers} posts=${posts} comments=${comments} stats=${stats}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});