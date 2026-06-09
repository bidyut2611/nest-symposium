import prisma from '../../lib/prisma.js';

export const revalidate = 0;

export const metadata = {
  title: 'Accommodation | NEST Cluster Symposium 2026',
  description: 'Find accommodation options for the NEST Cluster Symposium 2026 at IIT Guwahati.',
};

export default async function Accommodation() {
  const options = await prisma.accommodationOption.findMany({ orderBy: { order: 'asc' } });
  const intro = await prisma.contentBlock.findUnique({ where: { slug: 'accommodation-intro' } });
  const content = await prisma.contentBlock.findUnique({ where: { slug: 'accommodation-content' } });
  const contactEmail = await prisma.contentBlock.findUnique({ where: { slug: 'contact-email' } });
  const mapEmbed = await prisma.contentBlock.findUnique({ where: { slug: 'contact-map-embed' } });

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container animate-fade-in">
          <h1>Accommodation</h1>
          <p>{intro?.content || 'Find the perfect stay for the NEST Cluster Symposium 2026.'}</p>
        </div>
      </section>

      {/* Accommodation Options */}
      <section className="section">
        <div className="container">
          {content?.content && (
            <div className="card text-center" style={{ maxWidth: '800px', margin: '-3rem auto 3rem', position: 'relative', zIndex: 10 }}>
              <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>{content.content}</p>
            </div>
          )}

          <div className="text-center mb-8">
            <h2>Where to Stay</h2>
            <p className="text-muted mt-2">Recommended accommodation options for symposium attendees</p>
          </div>

          <div className="accommodation-grid">
            {options.map((opt) => {
              const amenities = opt.amenities ? opt.amenities.split(',').map(a => a.trim()).filter(Boolean) : [];

              return (
                <div key={opt.id} className="accom-card">
                  <div className="accom-card-header">
                    <span className="accom-type-badge">{opt.type}</span>
                    <h3>{opt.name}</h3>
                    <div className="accom-price">{opt.priceRange}</div>
                  </div>
                  <div className="accom-card-body">
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
                      {opt.description}
                    </p>

                    {amenities.length > 0 && (
                      <div className="amenities-list">
                        {amenities.map((amenity, i) => (
                          <span key={i} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    )}

                    {opt.contactInfo && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                        📞 {opt.contactInfo}
                      </p>
                    )}

                    {opt.bookingUrl && (
                      <a
                        href={opt.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary mt-4"
                        style={{ width: '100%' }}
                      >
                        Book Now
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {options.length === 0 && (
            <div className="text-center" style={{ padding: '3rem 0' }}>
              <p className="text-muted" style={{ fontSize: '1.2rem' }}>Accommodation details will be announced soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Map */}
      {mapEmbed?.content && (
        <section style={{ padding: '0 0 3rem' }}>
          <div className="container">
            <div className="text-center mb-8">
              <h2>Venue Location</h2>
              <p className="text-muted mt-2">IIT Guwahati Campus</p>
            </div>
            <div className="map-container">
              <iframe
                src={mapEmbed.content}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Venue Location Map"
              />
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '700px', margin: '0 auto', borderLeft: '4px solid var(--primary)' }}>
            <h3 className="mb-2">Need Assistance?</h3>
            <p className="text-muted mb-4">
              Our organizing committee is here to help you find the best stay for the duration of the symposium.
              Feel free to reach out for special requirements or group bookings.
            </p>
            <a href={`mailto:${contactEmail?.content || 'nestcluster@gmail.com'}`} className="btn btn-secondary">
              ✉️ Contact Accommodation Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
