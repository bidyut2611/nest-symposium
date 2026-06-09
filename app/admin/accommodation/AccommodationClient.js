'use client';

import { useState } from 'react';
import { saveAccommodationOption, deleteAccommodationOption } from '../actions';

export default function AccommodationClient({ initialOptions }) {
  const [options, setOptions] = useState(initialOptions);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (option) => {
    setEditingId(option.id);
    setFormData(option);
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({ name: '', type: 'On-Campus', priceRange: '', amenities: '', description: '', contactInfo: '', bookingUrl: '', order: 0 });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = { ...formData, order: parseInt(formData.order) || 0 };
    if (editingId === 'new') delete dataToSave.id;
    
    await saveAccommodationOption(dataToSave);
    
    const savedData = { ...dataToSave, id: editingId === 'new' ? Date.now().toString() : editingId };
    const sorted = [...options.filter(o => o.id !== editingId), savedData].sort((a,b) => a.order - b.order);
    setOptions(sorted);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this accommodation option?')) {
      await deleteAccommodationOption(id);
      setOptions(options.filter(o => o.id !== id));
    }
  };

  if (editingId) {
    return (
      <div>
        <h2 className="mb-4">{editingId === 'new' ? 'Add Accommodation Option' : 'Edit Accommodation Option'}</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-control" value={formData.type || 'On-Campus'} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="On-Campus">On-Campus</option>
                <option value="Hotel">Hotel</option>
                <option value="Guest House">Guest House</option>
                <option value="Hostel">Hostel</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Price Range</label>
              <input type="text" className="form-control" value={formData.priceRange || ''} onChange={e => setFormData({...formData, priceRange: e.target.value})} required placeholder="e.g. ₹2,000 - ₹4,000 per night" />
            </div>
            <div className="form-group">
              <label className="form-label">Amenities (Comma-separated)</label>
              <input type="text" className="form-control" value={formData.amenities || ''} onChange={e => setFormData({...formData, amenities: e.target.value})} placeholder="Wi-Fi, Air Conditioning, Breakfast" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="4" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>

          <div className="grid-2">
             <div className="form-group">
               <label className="form-label">Contact Info (Phone/Email)</label>
               <input type="text" className="form-control" value={formData.contactInfo || ''} onChange={e => setFormData({...formData, contactInfo: e.target.value})} />
             </div>
             <div className="form-group">
               <label className="form-label">Booking URL (Optional)</label>
               <input type="url" className="form-control" value={formData.bookingUrl || ''} onChange={e => setFormData({...formData, bookingUrl: e.target.value})} placeholder="https://..." />
             </div>
          </div>

          <div className="form-group">
             <label className="form-label">Display Order</label>
             <input type="number" className="form-control" style={{ maxWidth: '200px' }} value={formData.order || 0} onChange={e => setFormData({...formData, order: e.target.value})} />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">Save Option</button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h2>Manage Accommodation Options</h2>
        <button className="btn btn-primary" onClick={handleCreate}>+ Add Option</button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem 0.5rem' }}>Order</th>
              <th style={{ padding: '1rem 0.5rem' }}>Name</th>
              <th style={{ padding: '1rem 0.5rem' }}>Type</th>
              <th style={{ padding: '1rem 0.5rem' }}>Price Range</th>
              <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {options.map(opt => (
              <tr key={opt.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>{opt.order}</td>
                <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{opt.name}</td>
                <td style={{ padding: '1rem 0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'var(--bg-dark)', color: 'white', borderRadius: '4px' }}>
                    {opt.type}
                  </span>
                </td>
                <td style={{ padding: '1rem 0.5rem' }}>{opt.priceRange}</td>
                <td style={{ padding: '1rem 0.5rem', whiteSpace: 'nowrap' }}>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', marginRight: '0.5rem' }} onClick={() => handleEdit(opt)}>Edit</button>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleDelete(opt.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {options.length === 0 && <p className="text-muted mt-4">No accommodation options created yet.</p>}
      </div>
    </div>
  );
}
