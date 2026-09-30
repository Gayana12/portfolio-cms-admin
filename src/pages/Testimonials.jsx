import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusMessage from '../components/StatusMessage';
import ImageUpload from '../components/ImageUpload';

const empty = { authorName: '', authorRole: '', company: '', quote: '', avatarUrl: '', rating: 5, displayOrder: 0 };

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/testimonials').then((res) => setItems(res.data));

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'rating' || name === 'displayOrder' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, form);
      } else {
        await api.post('/testimonials', form);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleEdit = (t) => {
    setForm({
      authorName: t.authorName, authorRole: t.authorRole || '', company: t.company || '',
      quote: t.quote, avatarUrl: t.avatarUrl || '', rating: t.rating || 5, displayOrder: t.displayOrder || 0,
    });
    setEditingId(t.id);
  };

  const handleCancel = () => {
    setForm(empty);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    await api.delete(`/testimonials/${id}`);
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Testimonials</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded border mb-6">
        <h2 className="font-semibold mb-3">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
        <StatusMessage error={error} />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input name="authorName" placeholder="Author Name" value={form.authorName} onChange={handleChange} className="border rounded px-3 py-2" required />
          <input name="authorRole" placeholder="Role" value={form.authorRole} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="border rounded px-3 py-2" />
            <div>
            <label className="block text-xs text-gray-500 mb-1">Rating (1-5)</label>
            <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
          <textarea name="quote" placeholder="Quote" value={form.quote} onChange={handleChange} rows={3} className="border rounded px-3 py-2 col-span-2" required />
            <div>
            <label className="block text-xs text-gray-500 mb-1">Display Order</label>
            <input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
          <div className="col-span-2">
            <ImageUpload
              label="Avatar"
              value={form.avatarUrl}
              onChange={(url) => setForm({ ...form, avatarUrl: url })}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="px-4 py-2 rounded border">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded border divide-y">
        {items.map((t) => (
          <div key={t.id} className="flex justify-between items-center p-3">
            <div>
              <p className="font-medium">{t.authorName} <span className="text-sm text-gray-500">{t.authorRole && `· ${t.authorRole}`}</span></p>
              <p className="text-sm text-gray-500 italic">"{t.quote.slice(0, 60)}{t.quote.length > 60 ? '...' : ''}"</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(t)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="p-4 text-gray-500 text-sm">No testimonials yet.</p>}
      </div>
    </div>
  );
}
