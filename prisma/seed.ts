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

async function main() {
  await prisma.user.upsert({
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
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}\n`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });