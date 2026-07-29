import Link from 'next/link';

export const metadata = {
  title: 'Sponsor List | OCTAVATE',
  description: 'View the esteemed local and global sponsors for the OCTAVATE symposium.',
};

export default function SponsorList() {
  return (
    <div>
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container animate-fade-in">
          <h1>Sponsor List</h1>
          <p style={{ marginBottom: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            North Eastern Science & Technology Cluster (NEST) for promoting Research, Innovation & Skill Development proudly presents the sponsors for OCTAVATE.
          </p>
        </div>
      </section>

      {/* Sponsors Content */}
      <section className="section" style={{ padding: '4rem 0', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          
          {/* LOCAL SPONSORS */}
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>
                 Associate Partners for OCTAVATE: LOCAL
              </h2>
              <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--accent)', margin: '0 auto' }}></div>
            </div>
            
            <div style={{ textAlign: 'center', background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              {/* This will load Slide 2 */}
              <img 
                src="/local-sponsors.png" 
                alt="Local Sponsors" 
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} 
              />
            </div>
          </div>

          {/* GLOBAL SPONSORS */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>
                Associate Partners for OCTAVATE: GLOBAL
              </h2>
              <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--accent)', margin: '0 auto' }}></div>
            </div>
            
            <div style={{ textAlign: 'center', background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              {/* This will load Slide 3 */}
              <img 
                src="/global-sponsors.png" 
                alt="Global Sponsors" 
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} 
              />
            </div>
          </div>

          {/* Back Button */}
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link href="/sponsorship" className="btn btn-outline btn-lg">
              ← Back to Sponsorship Packages
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
