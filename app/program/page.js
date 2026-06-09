import prisma from '../../lib/prisma.js';
import ProgramClient from './ProgramClient';

export const revalidate = 0;

export const metadata = {
  title: 'Program | NEST Cluster Symposium 2026',
  description: 'View the full program and schedule for the NEST Cluster Symposium 2026.',
};

export default async function ProgramPage() {
  const events = await prisma.event.findMany({
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });

  const programIntro = await prisma.contentBlock.findUnique({ where: { slug: 'program-intro' } });
  const brochureUrl = await prisma.contentBlock.findUnique({ where: { slug: 'brochure-url' } });
  const registerUrl = await prisma.contentBlock.findUnique({ where: { slug: 'register-url' } });

  return (
    <ProgramClient
      events={events}
      intro={programIntro?.content || ''}
      brochureUrl={brochureUrl?.content || ''}
      registerUrl={registerUrl?.content || ''}
    />
  );
}
