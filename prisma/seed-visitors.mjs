import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const NE_STATES = [
  { stateCode: 'AR', stateName: 'Arunachal Pradesh' },
  { stateCode: 'AS', stateName: 'Assam' },
  { stateCode: 'MN', stateName: 'Manipur' },
  { stateCode: 'ML', stateName: 'Meghalaya' },
  { stateCode: 'MZ', stateName: 'Mizoram' },
  { stateCode: 'NL', stateName: 'Nagaland' },
  { stateCode: 'SK', stateName: 'Sikkim' },
  { stateCode: 'TR', stateName: 'Tripura' },
];

async function main() {
  console.log('Seeding visitor counts for NE states...');

  for (const state of NE_STATES) {
    await prisma.stateVisitorCount.upsert({
      where: { stateCode: state.stateCode },
      update: {},
      create: {
        stateCode: state.stateCode,
        stateName: state.stateName,
        count: 0,
      },
    });
    console.log(`  ✓ ${state.stateName} (${state.stateCode})`);
  }

  console.log('\nDone! All 8 NE states seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
