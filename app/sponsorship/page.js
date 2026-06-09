import prisma from '../../lib/prisma.js';

export const revalidate = 0;

export const metadata = {
  title: 'Sponsorship & Exhibition | NEST Cluster Symposium 2026',
  description: 'Explore sponsorship opportunities and exhibition packages for the NEST Cluster Symposium 2026.',
};

export default async function SponsorshipPage() {
  const tiers = await prisma.sponsorTier.findMany({ orderBy: { order: 'asc' } });
  const sponsorIntro = await prisma.contentBlock.findUnique({ where: { slug: 'sponsorship-intro' } });
  const sponsorContact = await prisma.contentBlock.findUnique({ where: { slug: 'sponsorship-contact' } });
  const exhibitionIntro = await prisma.contentBlock.findUnique({ where: { slug: 'exhibition-intro' } });
  const registerUrl = await prisma.contentBlock.findUnique({ where: { slug: 'register-url' } });

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container animate-fade-in">
          <h1>Sponsorship &amp; Exhibition</h1>
          <p>{sponsorIntro?.content || 'Partner with us to showcase your brand at the NEST Cluster Symposium 2026.'}</p>
        </div>
      </section>

      {/* Sponsor Tiers */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-8">
            <h2>Sponsorship Packages</h2>
            <p className="text-muted mt-2">Choose the package that best fits your organization&apos;s goals</p>
          </div>

          <div className="tiers-grid">
            {tiers.map((tier) => {
              let benefits = [];
              try { benefits = JSON.parse(tier.benefits); } catch { benefits = [tier.benefits]; }

              return (
                <div key={tier.id} className="tier-card">
                  <div className="tier-card-header" style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}dd)` }}>
                    <h3>{tier.name}</h3>
                    <div className="tier-price">{tier.price}</div>
                  </div>
                  <div className="tier-card-body">
                    <ul className="tier-benefits">
                      {benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                    {registerUrl?.content && (
                      <a
                        href={registerUrl.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary mt-4"
                        style={{ width: '100%' }}
                      >
                        Inquire Now
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {tiers.length === 0 && (
            <div className="text-center" style={{ padding: '3rem 0' }}>
              <p className="text-muted" style={{ fontSize: '1.2rem' }}>Sponsorship packages will be announced soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Exhibition */}
      <section className="exhibition-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🏛️ Exhibition</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9 }}>
              {exhibitionIntro?.content || 'The exhibition provides an excellent platform to showcase your innovations.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📍</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Prime Location</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Main conference foyer with high visibility</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>500+ Attendees</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Connect with researchers &amp; professionals</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔬</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Live Demos</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Showcase products &amp; innovations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section">
        <div className="container">
          <div className="card text-center" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Interested in Sponsoring?</h2>
            <p className="text-muted" style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
              {sponsorContact?.content || 'Contact our sponsorship team for more details.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" className="btn btn-primary btn-lg">Contact Us</a>
              {registerUrl?.content && (
                <a href={registerUrl.content} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                  Download Prospectus
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
