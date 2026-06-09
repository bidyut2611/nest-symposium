import { isAuthenticated } from '../../lib/auth.js';
import './admin.css';

export const revalidate = 0;

export default async function AdminLayout({ children }) {
  const authed = await isAuthenticated();

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
        {children}
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="text-accent">NEST</span> Admin
        </div>
        <ul className="admin-nav">
          <li className="admin-nav-item"><a href="/admin">Dashboard</a></li>
          <li className="admin-nav-item"><a href="/admin/speakers">Speakers</a></li>
          <li className="admin-nav-item"><a href="/admin/schedule">Schedule</a></li>
          <li className="admin-nav-item"><a href="/admin/sponsors">Sponsors</a></li>
          <li className="admin-nav-item"><a href="/admin/accommodation">Accommodation</a></li>
          <li className="admin-nav-item"><a href="/admin/content">Content Blocks</a></li>
          <li className="admin-nav-item mt-8">
            <a href="/" target="_blank">View Live Site ↗</a>
          </li>
          <li className="admin-nav-item">
            <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
              <button type="submit" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '0.75rem var(--space-md)', color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>Logout</button>
            </form>
          </li>
        </ul>
      </aside>
      <main className="admin-content">
        <div className="card" style={{ minHeight: 'calc(100vh - 4rem)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
