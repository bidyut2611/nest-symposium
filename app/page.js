import prisma from '../lib/prisma.js';

export const revalidate = 0; // Disable static caching for live data

export default async function Home() {
  const heroTitle = await prisma.contentBlock.findUnique({ where: { slug: 'hero-title' } });
  const heroSubtitle = await prisma.contentBlock.findUnique({ where: { slug: 'hero-subtitle' } });
  const heroDate = await prisma.contentBlock.findUnique({ where: { slug: 'hero-date' } });
  const aboutTitle = await prisma.contentBlock.findUnique({ where: { slug: 'about-title' } });
  const aboutContent = await prisma.contentBlock.findUnique({ where: { slug: 'about-content' } });
  const registerUrl = await prisma.contentBlock.findUnique({ where: { slug: 'register-url' } });
  
  const featuredSpeakers = await prisma.speaker.findMany({
    take: 3,
    orderBy: { order: 'asc' }
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="section section-dark text-center page-hero" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {heroDate?.content || 'August 15-16, 2026'}
          </span>
          <h1 style={{ fontSize: '4rem', margin: '1rem 0' }}>{heroTitle?.content || 'Symposium 2026'}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', opacity: 0.8, maxWidth: '800px', margin: '0 auto 2rem' }}>
            {heroSubtitle?.content}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {registerUrl?.content && (
              <a href="/register" className="btn btn-accent btn-lg">Register Now</a>
            )}
            <a href="/program" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>View Program</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <div className="card text-center" style={{ maxWidth: '800px', margin: '0 auto', transform: 'translateY(-80px)', position: 'relative', zIndex: 10 }}>
            <h2>{aboutTitle?.content || 'About'}</h2>
            <p className="text-muted mt-4">{aboutContent?.content}</p>
          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Keynote Speakers</h2>
            <p className="text-muted mt-2">Hear from the leading minds in technology</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {featuredSpeakers.map(speaker => (
              <div key={speaker.id} className="card text-center">
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold', overflow: 'hidden' }}>
                  {speaker.imageUrl ? (
                    <img src={speaker.imageUrl} alt={speaker.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    speaker.name.charAt(0)
                  )}
                </div>
                <h3>{speaker.name}</h3>
                <p className="text-primary font-weight-bold">{speaker.title}</p>
                <p className="text-muted mt-2" style={{ fontSize: '0.875rem' }}>{speaker.bio}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/speakers" className="btn btn-secondary">View All Speakers</a>
          </div>
        </div>
      </section>
    </div>
  );
}
