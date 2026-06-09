import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const newBlocks = [
    { slug: 'registration-intro', title: 'Registration Page Intro', content: 'Please follow the steps below to complete your registration for the NEST Cluster Symposium 2026. First, make your payment using the details provided, and then fill out the registration form with your transaction ID.' },
    { slug: 'payment-details', title: 'Payment Bank Details', content: 'Account Name: NEST Symposium\nAccount Number: 123456789012\nBank Name: State Bank of India\nIFSC Code: SBIN0014262\nBranch: IIT Guwahati' },
    { slug: 'payment-qr-url', title: 'Payment QR Code Image URL', content: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' }
  ];

  for (const block of newBlocks) {
    const existing = await prisma.contentBlock.findUnique({ where: { slug: block.slug } });
    if (!existing) {
      await prisma.contentBlock.create({ data: block });
      console.log(`Created content block: ${block.slug}`);
    } else {
      console.log(`Skipped (exists): ${block.slug}`);
    }
  }
  
  console.log('Registration data migration complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
