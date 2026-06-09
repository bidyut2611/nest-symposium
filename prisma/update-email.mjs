import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  await prisma.contentBlock.update({
    where: { slug: 'contact-email' },
    data: { content: 'nestcluster@gmail.com' }
  });

  const sponsorshipContact = await prisma.contentBlock.findUnique({ where: { slug: 'sponsorship-contact' } });
  if (sponsorshipContact && sponsorshipContact.content.includes('symposium@nestcluster.edu.in')) {
    await prisma.contentBlock.update({
      where: { slug: 'sponsorship-contact' },
      data: { content: sponsorshipContact.content.replace('symposium@nestcluster.edu.in', 'nestcluster@gmail.com') }
    });
  }
  
  console.log('Database emails updated successfully.');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
