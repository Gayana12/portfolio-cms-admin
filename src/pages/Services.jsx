import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusMessage from '../components/StatusMessage';

const empty = { title: '', description: '', icon: '', displayOrder: 0 };

export default function Services() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/services').then((res) => setItems(res.data));

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'displayOrder' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, form);
      } else {
        await api.post('/services', form);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleEdit = (s) => {
    setForm({ title: s.title, description: s.description || '', icon: s.icon || '', displayOrder: s.displayOrder || 0 });
    setEditingId(s.id);
  };

  const handleCancel = () => {
    setForm(empty);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`);
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Services</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded border mb-6">
        <h2 className="font-semibold mb-3">{editingId ? 'Edit Service' : 'Add Service'}</h2>
        <StatusMessage error={error} />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} className="border rounded px-3 py-2 col-span-2" />
            <div>
            <label className="block text-xs text-gray-500 mb-1">Icon Name</label>
            <input name="icon" placeholder="e.g. code, design, camera" value={form.icon} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Display Order</label>
            <input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
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
        {items.map((s) => (
          <div key={s.id} className="flex justify-between items-center p-3">
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-sm text-gray-500">{s.description?.slice(0, 60)}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="p-4 text-gray-500 text-sm">No services yet.</p>}
      </div>
    </div>
  );
}
