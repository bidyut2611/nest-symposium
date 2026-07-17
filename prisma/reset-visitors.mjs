import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting all visitor counts to 0...');

  await prisma.stateVisitorCount.updateMany({
    data: { count: 0 },
  });

  console.log('Clearing visitor logs...');
  await prisma.visitorLog.deleteMany({});

  console.log('\nReset complete! Refresh your localhost page.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
