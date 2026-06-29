'use client';

import { useState } from 'react';

const DAY_TITLES = {
  '2026-08-10': { title: 'Day 1 – Registration & Inaugural Day', aims: 'Welcome delegates, formally inaugurate the conference, showcase culture from the North Eastern states, and create early networking opportunities.' },
  '2026-08-11': { title: 'Day 2 – Product Expo, Technologies & Hackathon Session', aims: '' },
  '2026-08-12': { title: 'Day 3 – Product Expo, Startup, Policy Making & Closing Ceremony', aims: '' },
};

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

  const getCategoryLabel = (cat) => {
    const map = {
      keynote: '🎙️ Keynote',
      session: '📋 Session',
      workshop: '🔧 Workshop',
      ceremony: '🎉 Ceremony',
      panel: '💬 Panel',
      break: '☕ Break',
    };
    return map[cat] || cat;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${ampm}`;
  };

  const currentDate = dates[activeDay];
  const currentDayEvents = groupedEvents[currentDate] || [];
  const dayMeta = DAY_TITLES[currentDate] || {};

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container animate-fade-in">
          <h1>Symposium Program</h1>
          <p style={{ marginBottom: '0.5rem', fontSize: '1rem', opacity: 0.7, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Tentative Schedule
          </p>
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

          {/* Day Title & Aims */}
          {dayMeta.title && (
            <div style={{
              textAlign: 'center',
              margin: '1.5rem auto 0',
              maxWidth: '800px',
              animation: 'fadeSlideUp 0.4s ease forwards',
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: 'var(--secondary-dark)',
                marginBottom: '0.5rem',
                fontWeight: 700,
              }}>
                {dayMeta.title}
              </h2>
              {dayMeta.aims && (
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}>
                  <strong>Aims:</strong> {dayMeta.aims}
                </p>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="program-timeline" key={activeDay}>
            {currentDayEvents.map((event, idx) => (
              <div className="timeline-item" key={event.id} style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="timeline-time">
                  <div className="timeline-time-label">
                    {formatTime(event.startTime)}
                    <br />
                    {formatTime(event.endTime)}
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
                      {getCategoryLabel(event.category)}
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

          {/* Category Legend */}
          {dates.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center',
              margin: '3rem auto 0',
              maxWidth: '700px',
            }}>
              {[
                { cat: 'ceremony', label: 'Ceremony', color: '#ec4899' },
                { cat: 'keynote', label: 'Keynote', color: '#6366f1' },
                { cat: 'session', label: 'Session', color: 'var(--primary)' },
                { cat: 'panel', label: 'Panel', color: '#0ea5e9' },
                { cat: 'workshop', label: 'Workshop / Hackathon', color: '#d97706' },
                { cat: 'break', label: 'Break / Meal', color: '#94a3b8' },
              ].map(item => (
                <div key={item.cat} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: item.color,
                    flexShrink: 0,
                  }} />
                  {item.label}
                </div>
              ))}
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
