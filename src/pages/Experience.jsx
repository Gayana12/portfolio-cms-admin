import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusMessage from '../components/StatusMessage';
import ImageUpload from '../components/ImageUpload';

const empty = {
  company: '', jobTitle: '', type: 'WORK', location: '', startDate: '',
  endDate: '', currentlyWorking: false, description: '', companyLogoUrl: '',
};

export default function Experience() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/experience').then((res) => setItems(res.data));

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, endDate: form.currentlyWorking ? null : (form.endDate || null) };
    try {
      if (editingId) {
        await api.put(`/experience/${editingId}`, payload);
      } else {
        await api.post('/experience', payload);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleEdit = (x) => {
    setForm({
      company: x.company, jobTitle: x.jobTitle, type: x.type || 'WORK', location: x.location || '',
      startDate: x.startDate, endDate: x.endDate || '', currentlyWorking: x.currentlyWorking,
      description: x.description || '', companyLogoUrl: x.companyLogoUrl || '',
    });
    setEditingId(x.id);
  };

  const handleCancel = () => {
    setForm(empty);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    await api.delete(`/experience/${id}`);
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Experience</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded border mb-6">
        <h2 className="font-semibold mb-3">{editingId ? 'Edit Entry' : 'Add Entry'}</h2>
        <StatusMessage error={error} />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input name="company" placeholder="Company / School" value={form.company} onChange={handleChange} className="border rounded px-3 py-2" required />
          <input name="jobTitle" placeholder="Job Title / Degree" value={form.jobTitle} onChange={handleChange} className="border rounded px-3 py-2" required />
          <select name="type" value={form.type} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="WORK">Work</option>
            <option value="EDUCATION">Education</option>
          </select>
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border rounded px-3 py-2" />
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End Date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} disabled={form.currentlyWorking} className="border rounded px-3 py-2 w-full disabled:bg-gray-100" />
          </div>
          <label className="flex items-center gap-1 text-sm col-span-2">
            <input type="checkbox" name="currentlyWorking" checked={form.currentlyWorking} onChange={handleChange} /> Currently here
          </label>
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} className="border rounded px-3 py-2 col-span-2" />
          <div className="col-span-2">
            <ImageUpload
              label="Company/School Logo"
              value={form.companyLogoUrl}
              onChange={(url) => setForm({ ...form, companyLogoUrl: url })}
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
        {items.map((x) => (
          <div key={x.id} className="flex justify-between items-center p-3">
            <div>
              <p className="font-medium">{x.jobTitle} · {x.company}</p>
              <p className="text-sm text-gray-500">
                {x.type} · {x.startDate} - {x.currentlyWorking ? 'Present' : (x.endDate || '—')}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(x)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(x.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="p-4 text-gray-500 text-sm">No entries yet.</p>}
      </div>
    </div>
  );
}
