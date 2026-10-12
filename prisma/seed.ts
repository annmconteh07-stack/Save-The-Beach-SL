import "dotenv/config";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { Role } from "../src/generated/prisma/enums";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local", override: true });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "admin@savethebeach.sl";
const ADMIN_PASSWORD = "STBadmin@2026!";
const VOLUNTEER_ADMIN_EMAIL = "volunteer-admin@savethebeach.sl";
const VOLUNTEER_ADMIN_PASSWORD = "STBvolunteer@2026!";
const MEDIA_ADMIN_EMAIL = "media-admin@savethebeach.sl";
const MEDIA_ADMIN_PASSWORD = "STBmedia@2026!";

async function upsertAdmin(email: string, password: string, name: string, role: Role) {
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role,
      emailVerified: true,
      verifyToken: null,
      verifyTokenExpires: null,
    },
    create: {
      name,
      email,
      passwordHash,
      role,
      emailVerified: true,
    },
  });
}

async function main() {
  await upsertAdmin(ADMIN_EMAIL, ADMIN_PASSWORD, "Admin", Role.ADMIN);
  await upsertAdmin(
    VOLUNTEER_ADMIN_EMAIL,
    VOLUNTEER_ADMIN_PASSWORD,
    "Volunteer Admin",
    Role.VOLUNTEER_ADMIN,
  );
  await upsertAdmin(MEDIA_ADMIN_EMAIL, MEDIA_ADMIN_PASSWORD, "Media Admin", Role.MEDIA_ADMIN);

  const statDefaults = [
    { key: "bagsCollected", value: "" },
    { key: "beachesCovered", value: "" },
    { key: "cleanupsRun", value: "" },
    { key: "volunteers", value: "" },
  ];
  for (const stat of statDefaults) {
    await prisma.siteStat.upsert({
      where: { key: stat.key },
      update: {},
      create: stat,
    });
  }
}

main()
  .then(async () => {
    console.log("\nAdmin credentials:");
    console.log(`  Super admin:    ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    console.log(`  Volunteer admin: ${VOLUNTEER_ADMIN_EMAIL} / ${VOLUNTEER_ADMIN_PASSWORD}`);
    console.log(`  Media admin:     ${MEDIA_ADMIN_EMAIL} / ${MEDIA_ADMIN_PASSWORD}\n`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });