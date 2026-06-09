'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin({ isAuthed }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  if (isAuthed) {
    return (
      <div>
        <h1 className="mb-6">Admin Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
            <h3>Speakers</h3>
            <p className="mt-2 text-muted">Manage the keynote and guest speakers.</p>
            <a href="/admin/speakers" className="btn btn-primary mt-4">Manage Speakers</a>
          </div>
          <div className="card text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
            <h3>Schedule</h3>
            <p className="mt-2 text-muted">Manage the symposium events and sessions.</p>
            <a href="/admin/schedule" className="btn btn-primary mt-4">Manage Schedule</a>
          </div>
          <div className="card text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
            <h3>Sponsor Tiers</h3>
            <p className="mt-2 text-muted">Manage sponsorship packages and benefits.</p>
            <a href="/admin/sponsors" className="btn btn-primary mt-4">Manage Sponsors</a>
          </div>
          <div className="card text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
            <h3>Accommodation</h3>
            <p className="mt-2 text-muted">Manage accommodation options for attendees.</p>
            <a href="/admin/accommodation" className="btn btn-primary mt-4">Manage Accommodation</a>
          </div>
          <div className="card text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
            <h3>Content Blocks</h3>
            <p className="mt-2 text-muted">Edit text on the Home and other public pages.</p>
            <a href="/admin/content" className="btn btn-primary mt-4">Manage Content</a>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    if (res.ok) {
      router.refresh();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
      <div className="text-center mb-6">
        <h2 className="text-secondary-dark">Admin Login</h2>
        <p className="text-muted">Enter the master password to access the dashboard</p>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
}
