'use client';

import { useState } from 'react';

export default function ProgramClient({ events, intro, brochureUrl, registerUrl }) {
  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  const dates = Object.keys(groupedEvents);
  const [activeDay, setActiveDay] = useState(0);

  const getCategoryClass = (cat) => {
    const map = {
      keynote: 'cat-keynote',
      session: 'cat-session',
      workshop: 'cat-workshop',
      ceremony: 'cat-ceremony',
      panel: 'cat-panel',
      break: 'cat-break',
    };
    return map[cat] || 'cat-session';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentDayEvents = groupedEvents[dates[activeDay]] || [];

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container animate-fade-in">
          <h1>Program</h1>
          <p style={{ marginBottom: '2rem' }}>
            {intro || 'Explore the comprehensive program for the NEST Cluster Symposium 2026.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {brochureUrl && (
              <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">
                📄 Download Brochure
              </a>
            )}
            {registerUrl && (
              <a href="/register" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                Register Now →
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Day Tabs */}
      <section className="section">
        <div className="container">
          <div className="program-tabs">
            {dates.map((date, index) => (
              <button
                key={date}
                className={`program-tab ${activeDay === index ? 'active' : ''}`}
                onClick={() => setActiveDay(index)}
              >
                Day {index + 1} — {formatDate(date)}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="program-timeline" key={activeDay}>
            {currentDayEvents.map((event, idx) => (
              <div className="timeline-item" key={event.id} style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="timeline-time">
                  <div className="timeline-time-label">
                    {event.startTime}
                    <br />
                    {event.endTime}
                  </div>
                </div>
                <div className="timeline-dot" style={{
                  background: event.category === 'keynote' ? '#6366f1'
                    : event.category === 'workshop' ? '#d97706'
                    : event.category === 'ceremony' ? '#ec4899'
                    : event.category === 'panel' ? '#0ea5e9'
                    : event.category === 'break' ? '#94a3b8'
                    : 'var(--primary)'
                }} />
                <div className="timeline-card" style={{
                  borderLeftColor: event.category === 'keynote' ? '#6366f1'
                    : event.category === 'workshop' ? '#d97706'
                    : event.category === 'ceremony' ? '#ec4899'
                    : event.category === 'panel' ? '#0ea5e9'
                    : event.category === 'break' ? '#94a3b8'
                    : 'var(--primary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h3 style={{ flex: 1 }}>{event.title}</h3>
                    <span className={`category-badge ${getCategoryClass(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  {event.speaker && (
                    <p style={{ fontWeight: 600, color: 'var(--secondary)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      🎤 {event.speaker}
                    </p>
                  )}
                  <p>{event.description}</p>
                  {event.location && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--secondary-light)' }}>
                      📍 {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {dates.length === 0 && (
            <div className="text-center" style={{ padding: '4rem 0' }}>
              <p className="text-muted" style={{ fontSize: '1.2rem' }}>Program schedule will be announced soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Register CTA */}
      {registerUrl && (
        <section className="section-dark" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <div className="container animate-fade-in">
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to Join?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Secure your spot at the NEST Cluster Symposium 2026. Early bird discounts available!
            </p>
            <a href="/register" className="btn btn-accent btn-lg">
              Register Now →
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
