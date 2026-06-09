'use client';

import { useState } from 'react';
import { saveSpeaker, deleteSpeaker } from '../actions';

export default function SpeakersClient({ initialSpeakers }) {
  const [speakers, setSpeakers] = useState(initialSpeakers);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (speaker) => {
    setEditingId(speaker.id);
    setFormData(speaker);
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({ name: '', title: '', bio: '', order: 0 });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (editingId === 'new') delete dataToSave.id;
    
    await saveSpeaker(dataToSave);
    
    // Optimistic update
    if (editingId === 'new') {
      setSpeakers([...speakers, { ...dataToSave, id: Date.now().toString() }].sort((a,b)=>a.order-b.order));
    } else {
      setSpeakers(speakers.map(s => s.id === editingId ? dataToSave : s).sort((a,b)=>a.order-b.order));
    }
    
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this speaker?')) {
      await deleteSpeaker(id);
      setSpeakers(speakers.filter(s => s.id !== id));
    }
  };

  if (editingId) {
    return (
      <div>
        <h2 className="mb-4">{editingId === 'new' ? 'Add Speaker' : 'Edit Speaker'}</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Title / Role</label>
            <input type="text" className="form-control" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-control" rows="4" value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} required></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input type="number" className="form-control" value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">Save Speaker</button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h2>Manage Speakers</h2>
        <button className="btn btn-primary" onClick={handleCreate}>+ Add Speaker</button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem 0.5rem' }}>Order</th>
              <th style={{ padding: '1rem 0.5rem' }}>Name</th>
              <th style={{ padding: '1rem 0.5rem' }}>Title</th>
              <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {speakers.map(speaker => (
              <tr key={speaker.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0.5rem' }}>{speaker.order}</td>
                <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{speaker.name}</td>
                <td style={{ padding: '1rem 0.5rem' }}>{speaker.title}</td>
                <td style={{ padding: '1rem 0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', marginRight: '0.5rem' }} onClick={() => handleEdit(speaker)}>Edit</button>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderColor: 'red', color: 'red' }} onClick={() => handleDelete(speaker.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {speakers.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No speakers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
