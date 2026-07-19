'use client';

import { useState } from 'react';

export default function ResourcesClient() {
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });

  const openLightbox = (src, alt) => {
    setLightbox({ open: true, src, alt });
  };

  const closeLightbox = () => {
    setLightbox({ open: false, src: '', alt: '' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container animate-fade-in">
          <h1>OCTAVATE Resources</h1>
          <p style={{ marginBottom: '1rem' }}>
            Explore the official brochure, program highlights, and downloadable booklet for OCTAVATE.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/OCTAVATE_Booklet.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">
              📄 Download Booklet (PDF)
            </a>
            <a href="#gallery" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
              View Gallery ↓
            </a>
          </div>
        </div>
      </section>

      {/* Resources Gallery */}
      <section className="section" id="gallery">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--primary)' }}>📌</span> Program Materials
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
              Browse through the official OCTAVATE brochure and program highlights. Click any image to view in full size.
            </p>
          </div>

          <div className="resources-grid">
            {/* Brochure Card */}
            <div className="resource-card">
              <div className="resource-card-badge">Brochure</div>
              <div
                className="resource-card-image"
                onClick={() => openLightbox('/OCTAVATE_Brochure_Final.jpg', 'OCTAVATE Brochure')}
              >
                <img
                  src="/OCTAVATE_Brochure_Final.jpg"
                  alt="OCTAVATE Brochure"
                  loading="lazy"
                />
                <div className="resource-card-overlay">
                  <span className="resource-zoom-icon">🔍</span>
                  <span>Click to enlarge</span>
                </div>
              </div>
              <div className="resource-card-body">
                <h3>OCTAVATE Brochure</h3>
                <p>Official brochure with complete event details, themes, and participation information.</p>
              </div>
            </div>

            {/* Program Highlights Card */}
            <div className="resource-card">
              <div className="resource-card-badge" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>Highlights</div>
              <div
                className="resource-card-image"
                onClick={() => openLightbox('/program_highlights.jpg', 'Program Highlights')}
              >
                <img
                  src="/program_highlights.jpg"
                  alt="Program Highlights"
                  loading="lazy"
                />
                <div className="resource-card-overlay">
                  <span className="resource-zoom-icon">🔍</span>
                  <span>Click to enlarge</span>
                </div>
              </div>
              <div className="resource-card-body">
                <h3>Program Highlights</h3>
                <p>Key highlights and featured sessions of the OCTAVATE symposium program.</p>
              </div>
            </div>

            {/* Booklet PDF Card */}
            <div className="resource-card">
              <div className="resource-card-badge" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>Booklet</div>
              <a
                href="/OCTAVATE_Booklet.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card-image resource-pdf-card"
              >
                <div className="resource-pdf-preview">
                  <div className="resource-pdf-icon">
                    <svg width="64" height="80" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 8C0 3.58172 3.58172 0 8 0H40L64 24V72C64 76.4183 60.4183 80 56 80H8C3.58172 80 0 76.4183 0 72V8Z" fill="white" fillOpacity="0.15"/>
                      <path d="M40 0L64 24H48C43.5817 24 40 20.4183 40 16V0Z" fill="white" fillOpacity="0.25"/>
                      <text x="32" y="56" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="var(--font-heading)">PDF</text>
                    </svg>
                  </div>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>OCTAVATE Booklet</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Click to open PDF</p>
                </div>
                <div className="resource-card-overlay">
                  <span className="resource-zoom-icon">📄</span>
                  <span>Open PDF</span>
                </div>
              </a>
              <div className="resource-card-body">
                <h3>OCTAVATE Booklet</h3>
                <p>Complete event booklet with detailed agenda, speaker profiles, and more.</p>
                <a
                  href="/OCTAVATE_Booklet.pdf"
                  download
                  className="btn btn-primary"
                  style={{ marginTop: '0.75rem', width: '100%' }}
                >
                  ⬇ Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Download Section */}
      <section className="section-dark" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="container animate-fade-in">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>📥 Quick Downloads</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Download all the OCTAVATE materials you need to prepare for the symposium.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/OCTAVATE_Brochure_Final.jpg" download className="btn btn-accent btn-lg">
              🖼️ Download Brochure
            </a>
            <a href="/program_highlights.jpg" download className="btn btn-accent btn-lg">
              🖼️ Download Highlights
            </a>
            <a href="/OCTAVATE_Booklet.pdf" download className="btn btn-accent btn-lg">
              📄 Download Booklet
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox.open && (
        <div className="resource-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">✕</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} />
            <p className="lightbox-caption">{lightbox.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
