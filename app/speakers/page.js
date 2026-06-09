import prisma from '../../lib/prisma.js';

export const revalidate = 0;

export default async function Speakers() {
  const speakers = await prisma.speaker.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="container section animate-fade-in">
      <div className="text-center mb-12">
        <h1 style={{ fontSize: '3rem' }}>Keynote Speakers</h1>
        <p className="text-muted mt-4 text-lg">Distinguished experts sharing their insights and research.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {speakers.map(speaker => (
          <div key={speaker.id} className="card" style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', flexShrink: 0 }}>
              {speaker.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>{speaker.name}</h3>
              <p className="text-primary" style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{speaker.title}</p>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>{speaker.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
