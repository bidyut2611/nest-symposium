import prisma from '../../lib/prisma.js';

export const revalidate = 0;

export const metadata = {
  title: 'Sponsorship & Exhibition | NEST Cluster Symposium 2026',
  description: 'Explore sponsorship opportunities and exhibition packages for the NEST Cluster Symposium 2026.',
};

// The sponsorship comparison data — stored as a ContentBlock so admin can edit it
const DEFAULT_COMPARISON_DATA = [
  {
    category: "Cost (INR)",
    platinum: "25 lakhs",
    diamond: "20 lakhs",
    gold: "15 lakhs",
    silver: "10 lakhs",
    bronze: "05 lakhs",
    isCost: true
  },
  {
    category: "Exhibitors",
    platinum: "Exhibit space in the expo area [incl. table, chair, electricity, TV and other items.] Exhibition space allocation will be made by the Conference organizers.",
    diamond: "Exhibit space in the expo area [incl. table, chair, electricity, TV and other items.] Exhibition space allocation will be made by the Conference organizers.",
    gold: "Exhibit space in the expo area [incl. table, chair, electricity, TV and other items.] Exhibition space allocation will be made by the Conference organizers.",
    silver: "Exhibit space in the expo area [incl. table, chair, electricity, TV and other items.] Exhibition space allocation will be made by the Conference organizers.",
    bronze: "—"
  },
  {
    category: "Sponsor Presentation",
    platinum: "10-minute sponsor presentation following your chosen presentation",
    diamond: "5-minute sponsor presentation following your chosen presentation",
    gold: "—",
    silver: "—",
    bronze: "—"
  },
  {
    category: "Advertisement",
    platinum: "Inclusion of the sponsor's logo in conference materials and gadgets provided to participants",
    diamond: "Inclusion of the sponsor's logo in conference materials and gadgets provided to participants",
    gold: "Inclusion of the sponsor's logo in conference materials and gadgets provided to participants",
    silver: "Inclusion of the sponsor's logo in conference materials and gadgets provided to participants",
    bronze: "—"
  },
  {
    category: "Pre-event Marketing",
    platinum: "Logo in email and Social-media post relating to your chosen presentation. Social media thank you sponsor post",
    diamond: "Social media thank you sponsor post",
    gold: "Social media thank you sponsor post",
    silver: "Social media thank you sponsor post",
    bronze: "—"
  },
  {
    category: "Conference Website",
    platinum: "Company logotype recognized as Platinum sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website.",
    diamond: "Company logotype recognized as Diamond sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website.",
    gold: "Company logotype recognized as Gold sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website.",
    silver: "Company logotype recognized as Silver sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website.",
    bronze: "Company logotype recognized as Bronze sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website."
  },
  {
    category: "Final Programme",
    platinum: "Company logotype recognized as Platinum sponsor in the Final Program",
    diamond: "Company logotype recognized as Diamond sponsor in the Final Program",
    gold: "Company logotype recognized as Gold sponsor in the Final Program",
    silver: "Company logotype recognized as Silver sponsor in the Final Program",
    bronze: "—"
  },
  {
    category: "List of Sponsors",
    platinum: "Company logotype recognized as Platinum sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall.",
    diamond: "Company logotype recognized as Diamond sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall.",
    gold: "Company logotype recognized as Gold sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall.",
    silver: "Company logotype recognized as Silver sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall.",
    bronze: "Company logotype recognized as Bronze sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall."
  },
  {
    category: "Exhibitors Signage",
    platinum: "Presented as Platinum sponsor at the opening of the Conference and Expo area",
    diamond: "Presented as Diamond sponsor at the opening of the Conference and Expo area",
    gold: "Presented as Gold sponsor at the Conference and Expo area",
    silver: "Presented as Silver sponsor at the Conference and Expo area",
    bronze: "—"
  },
  {
    category: "Complimentary Registrations",
    platinum: "Free registration for 10 delegates",
    diamond: "Free registration for 8 delegates",
    gold: "Free registration for 6 delegates",
    silver: "Free registration for 4 delegates",
    bronze: "Free registration for 2 delegates"
  },
  {
    category: "Expo Area / Space",
    platinum: "9 x 9 m stall for 3 days",
    diamond: "6 x 6 m stall for 3 days",
    gold: "3 x 3 m stall for 3 days",
    silver: "3 x 3 m stall for 3 days",
    bronze: "—"
  }
];

const tierColors = {
  platinum: { bg: 'linear-gradient(135deg, #1a1a2e, #16213e)', accent: '#e2e8f0', badge: '#a0aec0' },
  diamond: { bg: 'linear-gradient(135deg, #1e3a5f, #2d5a87)', accent: '#90cdf4', badge: '#63b3ed' },
  gold: { bg: 'linear-gradient(135deg, #744210, #975a16)', accent: '#fbd38d', badge: '#ecc94b' },
  silver: { bg: 'linear-gradient(135deg, #4a5568, #718096)', accent: '#e2e8f0', badge: '#a0aec0' },
  bronze: { bg: 'linear-gradient(135deg, #7b341e, #9c4221)', accent: '#fbd38d', badge: '#ed8936' }
};

export default async function SponsorshipPage() {
  const sponsorIntro = await prisma.contentBlock.findUnique({ where: { slug: 'sponsorship-intro' } });
  const sponsorContact = await prisma.contentBlock.findUnique({ where: { slug: 'sponsorship-contact' } });
  const comparisonBlock = await prisma.contentBlock.findUnique({ where: { slug: 'sponsorship-comparison' } });
  const registerUrl = await prisma.contentBlock.findUnique({ where: { slug: 'register-url' } });

  let comparisonData = DEFAULT_COMPARISON_DATA;
  if (comparisonBlock?.content) {
    try { comparisonData = JSON.parse(comparisonBlock.content); } catch {}
  }

  const tierKeys = ['platinum', 'diamond', 'gold', 'silver', 'bronze'];
  const tierLabels = ['Platinum Sponsor', 'Diamond Sponsor', 'Gold Sponsor', 'Silver Sponsor', 'Bronze Sponsor'];

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container animate-fade-in">
          <h1>Sponsorship &amp; Exhibition</h1>
          <p>{sponsorIntro?.content || 'Partner with us to showcase your brand at the NEST Cluster Symposium 2026.'}</p>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="section" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>OCTAVATE Sponsorship Packages Comparison</h2>
            <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>Choose the package that best fits your organization&apos;s goals and budget</p>
          </div>

          {/* Desktop Comparison Table */}
          <div className="sponsorship-table-wrapper">
            <table className="sponsorship-table">
              <thead>
                <tr>
                  <th className="sponsorship-table-feature-header">Feature / Benefits</th>
                  {tierKeys.map((key, i) => (
                    <th key={key} className={`sponsorship-table-tier-header tier-${key}`}>
                      <div className="tier-header-content">
                        <span className="tier-header-icon">
                          {key === 'platinum' && '💎'}
                          {key === 'diamond' && '🔷'}
                          {key === 'gold' && '🥇'}
                          {key === 'silver' && '🥈'}
                          {key === 'bronze' && '🥉'}
                        </span>
                        <span className="tier-header-label">{tierLabels[i]}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className={row.isCost ? 'cost-row' : ''}>
                    <td className="feature-cell">{row.category}</td>
                    {tierKeys.map((key) => (
                      <td key={key} className={`benefit-cell ${row.isCost ? 'cost-cell' : ''} ${row[key] === '—' ? 'not-included' : ''}`}>
                        {row[key] === '—' ? (
                          <span className="not-included-badge">—</span>
                        ) : (
                          <span>{row[key]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-muted text-center" style={{ marginTop: '1.5rem', fontSize: '0.95rem', fontStyle: 'italic' }}>
            Note: 18% GST is extra on the total amount.
          </p>
        </div>
      </section>

      {/* Tier Cards for Mobile (visible below 1024px) */}
      <section className="section sponsorship-cards-mobile">
        <div className="container">
          <div className="tiers-grid">
            {tierKeys.map((key, i) => {
              const tierBenefits = comparisonData
                .filter(row => !row.isCost && row[key] !== '—')
                .map(row => ({ category: row.category, detail: row[key] }));
              const costRow = comparisonData.find(r => r.isCost);
              const color = tierColors[key];

              return (
                <div key={key} className="tier-card" style={{ overflow: 'hidden' }}>
                  <div className="tier-card-header" style={{ background: color.bg, padding: '2rem 1.5rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>
                      {key === 'platinum' && '💎'}
                      {key === 'diamond' && '🔷'}
                      {key === 'gold' && '🥇'}
                      {key === 'silver' && '🥈'}
                      {key === 'bronze' && '🥉'}
                    </span>
                    <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>{tierLabels[i]}</h3>
                    <div className="tier-price" style={{ color: color.accent }}>{costRow ? costRow[key] : ''}</div>
                  </div>
                  <div className="tier-card-body" style={{ padding: '1.5rem' }}>
                    {tierBenefits.map((b, bi) => (
                      <div key={bi} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <strong style={{ color: 'var(--primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{b.category}</strong>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{b.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-muted text-center" style={{ marginTop: '1.5rem', fontSize: '0.95rem', fontStyle: 'italic' }}>
            Note: 18% GST is extra on the total amount.
          </p>
        </div>
      </section>

      {/* Exhibition */}
      <section className="exhibition-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🏛️ Exhibition</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9 }}>
              {prisma.contentBlock ? 'The exhibition provides an excellent platform to showcase your innovations, connect with leading researchers, and explore collaboration opportunities.' : ''}
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
