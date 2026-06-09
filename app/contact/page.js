import prisma from '../../lib/prisma.js';

export const revalidate = 0;

export const metadata = {
  title: 'Contact Us | NEST Cluster Symposium 2026',
  description: 'Get in touch with the NEST Cluster Symposium 2026 organizing team.',
};

export default async function ContactPage() {
  const email = await prisma.contentBlock.findUnique({ where: { slug: 'contact-email' } });
  const phone = await prisma.contentBlock.findUnique({ where: { slug: 'contact-phone' } });
  const address = await prisma.contentBlock.findUnique({ where: { slug: 'contact-address' } });
  const mapEmbed = await prisma.contentBlock.findUnique({ where: { slug: 'contact-map-embed' } });
  const formUrl = await prisma.contentBlock.findUnique({ where: { slug: 'contact-form-url' } });

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container animate-fade-in">
          <h1>Contact Us</h1>
          <p>Have questions about the symposium? We&apos;d love to hear from you.</p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Email Card */}
            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>Email</h3>
              <p>{email?.content || 'nestcluster@gmail.com'}</p>
              <a
                href={`mailto:${email?.content || 'nestcluster@gmail.com'}`}
                className="btn btn-outline mt-4"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}
              >
                Send Email
              </a>
            </div>

            {/* Phone Card */}
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone</h3>
              <p>{phone?.content || '+91 361 258 2000'}</p>
              <a
                href={`tel:${(phone?.content || '+91 361 258 2000').replace(/\s/g, '')}`}
                className="btn btn-outline mt-4"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}
              >
                Call Us
              </a>
            </div>

            {/* Address Card */}
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Address</h3>
              <p>{address?.content || 'IIT Guwahati, Assam, India'}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address?.content || 'IIT Guwahati')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline mt-4"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      {mapEmbed?.content && (
        <section style={{ padding: '0 0 3rem' }}>
          <div className="container">
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

      {/* Contact Form / Google Form */}
      {formUrl?.content && (
        <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="container">
            <div className="text-center mb-8">
              <h2>Send Us a Message</h2>
              <p className="text-muted mt-2">Fill out the form below and we&apos;ll get back to you shortly</p>
            </div>
            <div style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
              <iframe
                src={formUrl.content}
                style={{ width: '100%', height: '600px', border: 'none' }}
                title="Contact Form"
                loading="lazy"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </section>
      )}

      {/* Organizing Committee */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Organizing Committee</h2>
            <p className="text-muted" style={{ lineHeight: '1.8', marginBottom: '2rem' }}>
              The NEST Cluster Symposium 2026 is organized by the NEST research cluster at IIT Guwahati.
              For general inquiries, sponsorship, or accommodation, please reach out through any of the channels above.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={`mailto:${email?.content || 'nestcluster@gmail.com'}`} className="btn btn-primary">
                ✉️ Write to Us
              </a>
              <a href="/sponsorship" className="btn btn-outline">
                Become a Sponsor
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
