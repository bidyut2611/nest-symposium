'use client';

import { useState } from 'react';
import { saveContentBlock } from '../actions';

export default function ContentClient({ initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveContentBlock(formData);
    
    // Update local state
    setContent(content.map(c => c.id === editingId ? formData : c));
    setEditingId(null);
  };

  if (editingId) {
    return (
      <div>
        <h2 className="mb-4">Edit Content Block</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
          <div className="form-group">
            <label className="form-label">Block ID (Slug)</label>
            <input type="text" className="form-control" value={formData.slug || ''} disabled style={{ backgroundColor: '#f1f5f9' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea className="form-control" rows="8" value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} required></textarea>
            <p className="mt-1 text-muted" style={{ fontSize: '0.875rem' }}>Basic text or simple HTML might be supported depending on where this is rendered.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">Save Content</button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h2>Manage Content Blocks</h2>
      </div>
      <p className="text-muted mb-6">Edit text content for various sections of the website.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {content.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="mb-2">{item.title}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>ID: <code>{item.slug}</code></p>
            <p style={{ flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', marginBottom: '1rem' }}>
              {item.content}
            </p>
            <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }} onClick={() => handleEdit(item)}>Edit Content</button>
          </div>
        ))}
      </div>
    </div>
  );
}
