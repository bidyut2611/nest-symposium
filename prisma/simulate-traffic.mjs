import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const NE_STATES = ['AR', 'AS', 'MN', 'ML', 'MZ', 'NL', 'SK', 'TR'];

async function main() {
  console.log('Simulating website traffic for NE states...\n');

  for (const stateCode of NE_STATES) {
    // Generate a random number of visitors between 10 and 500
    const randomCount = Math.floor(Math.random() * 490) + 10;
    
    await prisma.stateVisitorCount.update({
      where: { stateCode: stateCode },
      data: { count: randomCount },
    });
    
    console.log(`Updated ${stateCode} to ${randomCount} visitors`);
  }

  console.log('\nTraffic simulation complete! Refresh your localhost page to see the new counts.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
