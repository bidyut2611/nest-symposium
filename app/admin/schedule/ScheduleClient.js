'use client';

import { useState } from 'react';
import { saveEvent, deleteEvent } from '../actions';

export default function ScheduleClient({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData(event);
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({ title: '', description: '', speaker: '', date: '', startTime: '', endTime: '', location: '', category: 'session', order: 0 });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (editingId === 'new') delete dataToSave.id;
    
    await saveEvent(dataToSave);
    
    // Sort logic simplified for optimism
    const sorted = [...events.filter(ev => ev.id !== editingId), { ...dataToSave, id: editingId === 'new' ? Date.now().toString() : editingId }]
      .sort((a,b) => new Date(`${a.date} ${a.startTime}`) - new Date(`${b.date} ${b.startTime}`));
    setEvents(sorted);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
      setEvents(events.filter(s => s.id !== id));
    }
  };

  if (editingId) {
    return (
      <div>
        <h2 className="mb-4">{editingId === 'new' ? 'Add Event' : 'Edit Event'}</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Event Title</label>
            <input type="text" className="form-control" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Speaker(s)</label>
            <input type="text" className="form-control" value={formData.speaker || ''} onChange={e => setFormData({...formData, speaker: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" className="form-control" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Date (YYYY-MM-DD)</label>
            <input type="date" className="form-control" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={formData.category || 'session'} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="session">Session</option>
              <option value="keynote">Keynote</option>
              <option value="workshop">Workshop</option>
              <option value="ceremony">Ceremony</option>
              <option value="panel">Panel</option>
              <option value="break">Break / Meal</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Start Time (HH:MM)</label>
            <input type="time" className="form-control" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">End Time (HH:MM)</label>
            <input type="time" className="form-control" value={formData.endTime || ''} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
          </div>
          
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">Save Event</button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h2>Manage Schedule</h2>
        <button className="btn btn-primary" onClick={handleCreate}>+ Add Event</button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem 0.5rem' }}>Date</th>
              <th style={{ padding: '1rem 0.5rem' }}>Time</th>
              <th style={{ padding: '1rem 0.5rem' }}>Title</th>
              <th style={{ padding: '1rem 0.5rem' }}>Category</th>
              <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0.5rem' }}>{event.date}</td>
                <td style={{ padding: '1rem 0.5rem', whiteSpace: 'nowrap' }}>{event.startTime} - {event.endTime}</td>
                <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{event.title}</td>
                <td style={{ padding: '1rem 0.5rem', textTransform: 'capitalize' }}>{event.category}</td>
                <td style={{ padding: '1rem 0.5rem', whiteSpace: 'nowrap' }}>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', marginRight: '0.5rem' }} onClick={() => handleEdit(event)}>Edit</button>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderColor: 'red', color: 'red' }} onClick={() => handleDelete(event.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
