import prisma from '../../lib/prisma.js';

export const revalidate = 0;

export default async function Schedule() {
  const events = await prisma.event.findMany({
    orderBy: [
      { date: 'asc' },
      { startTime: 'asc' }
    ]
  });

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  return (
    <div className="container section animate-fade-in">
      <div className="text-center mb-12">
        <h1 style={{ fontSize: '3rem' }}>Program Schedule</h1>
        <p className="text-muted mt-4 text-lg">Comprehensive agenda for the NEST Cluster Symposium 2026</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {Object.entries(groupedEvents).map(([date, dayEvents], index) => (
          <div key={date} className="mb-12">
            <h2 className="mb-6 pb-2" style={{ borderBottom: '2px solid var(--border)', color: 'var(--primary)' }}>
              Day {index + 1} - {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {dayEvents.map(event => (
                <div key={event.id} className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '150px', fontWeight: 'bold', color: 'var(--secondary)' }}>
                    {event.startTime} - {event.endTime}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{event.title}</h3>
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '600', color: 'var(--primary)' }}>
                        {event.category}
                      </span>
                    </div>
                    {event.speaker && (
                      <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>🎤 {event.speaker}</p>
                    )}
                    <p className="text-muted" style={{ marginBottom: '0.5rem' }}>{event.description}</p>
                    {event.location && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--secondary-light)' }}>📍 {event.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
