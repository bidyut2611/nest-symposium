import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const speakers = await prisma.speaker.findMany({ orderBy: { order: 'asc' } });
  
  if (speakers.length >= 1) {
    await prisma.speaker.update({ where: { id: speakers[0].id }, data: { imageUrl: '/speaker1.jpg' }});
  }
  if (speakers.length >= 2) {
    await prisma.speaker.update({ where: { id: speakers[1].id }, data: { imageUrl: '/speaker2.jpg' }});
  }
  if (speakers.length >= 3) {
    await prisma.speaker.update({ where: { id: speakers[2].id }, data: { imageUrl: '/speaker3.jpg' }});
  }
  
  console.log('Updated speaker images');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
