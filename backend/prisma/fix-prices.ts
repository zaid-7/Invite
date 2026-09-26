import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// One-off correction: align stored template prices with the pricing shown
// on the marketing pricing section (Classic ₹899 / Royal ₹1299).
// Safe to run more than once — it's an idempotent updateMany, not a create.
async function main() {
  const classic = await prisma.template.updateMany({
    where: { tier: 'BASIC' },
    data: { price: 89900 }, // Rs 899.00 in paise
  });
  const royal = await prisma.template.updateMany({
    where: { tier: 'PREMIUM' },
    data: { price: 129900 }, // Rs 1299.00 in paise
  });

  console.log(`Updated ${classic.count} Classic (BASIC) templates to price 89900`);
  console.log(`Updated ${royal.count} Royal (PREMIUM) templates to price 129900`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
