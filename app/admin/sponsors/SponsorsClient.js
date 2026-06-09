'use client';

import { useState } from 'react';
import { saveSponsorTier, deleteSponsorTier } from '../actions';

export default function SponsorsClient({ initialTiers }) {
  const [tiers, setTiers] = useState(initialTiers);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (tier) => {
    setEditingId(tier.id);
    // Convert benefits string (JSON array) to newline-separated text for textarea
    let benefitsText = '';
    try {
      const parsed = JSON.parse(tier.benefits);
      benefitsText = Array.isArray(parsed) ? parsed.join('\n') : String(tier.benefits);
    } catch {
      benefitsText = String(tier.benefits || '');
    }
    setFormData({ ...tier, benefits: benefitsText });
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({ name: '', price: '', color: '#075589', benefits: '', order: 0 });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert newline-separated text back to JSON string for storage
    const benefitsArray = (formData.benefits || '').split('\n').map(b => b.trim()).filter(Boolean);
    const dataToSave = { ...formData, benefits: JSON.stringify(benefitsArray), order: parseInt(formData.order) || 0 };
    
    if (editingId === 'new') delete dataToSave.id;
    
    await saveSponsorTier(dataToSave);
    
    // Optimistic update
    const savedData = { ...dataToSave, id: editingId === 'new' ? Date.now().toString() : editingId };
    const sorted = [...tiers.filter(t => t.id !== editingId), savedData].sort((a,b) => a.order - b.order);
    setTiers(sorted);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this sponsor tier?')) {
      await deleteSponsorTier(id);
      setTiers(tiers.filter(t => t.id !== id));
    }
  };

  if (editingId) {
    return (
      <div>
        <h2 className="mb-4">{editingId === 'new' ? 'Add Sponsor Tier' : 'Edit Sponsor Tier'}</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Tier Name</label>
              <input type="text" className="form-control" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Price / Contribution</label>
              <input type="text" className="form-control" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Theme Color (Hex code)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="color" value={formData.color || '#075589'} onChange={e => setFormData({...formData, color: e.target.value})} style={{ height: '42px', padding: '0.2rem' }} />
                <input type="text" className="form-control" value={formData.color || '#075589'} onChange={e => setFormData({...formData, color: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input type="number" className="form-control" value={formData.order || 0} onChange={e => setFormData({...formData, order: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Benefits (One per line)</label>
            <textarea className="form-control" rows="8" value={formData.benefits || ''} onChange={e => setFormData({...formData, benefits: e.target.value})} required placeholder="Logo on website&#10;5 complimentary passes&#10;Exhibition booth"></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">Save Tier</button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h2>Manage Sponsor Tiers</h2>
        <button className="btn btn-primary" onClick={handleCreate}>+ Add Tier</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {tiers.map(tier => {
           let benefits = [];
           try { benefits = JSON.parse(tier.benefits); } catch { benefits = [tier.benefits]; }

           return (
             <div key={tier.id} className="card" style={{ display: 'flex', flexDirection: 'column', borderTop: `4px solid ${tier.color}` }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                 <h3 style={{ margin: 0 }}>{tier.name}</h3>
                 <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{tier.price}</span>
               </div>
               
               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Benefits:</p>
               <ul style={{ fontSize: '0.875rem', marginBottom: '1.5rem', paddingLeft: '1.25rem', flex: 1, color: 'var(--text-muted)' }}>
                 {benefits.slice(0, 4).map((b, i) => <li key={i}>{b}</li>)}
                 {benefits.length > 4 && <li><em>+ {benefits.length - 4} more</em></li>}
               </ul>
               
               <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                 <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleEdit(tier)}>Edit</button>
                 <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleDelete(tier.id)}>Delete</button>
                 <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Order: {tier.order}</span>
               </div>
             </div>
           );
        })}
        {tiers.length === 0 && <p className="text-muted">No sponsor tiers created yet.</p>}
      </div>
    </div>
  );
}
