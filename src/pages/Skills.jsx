import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusMessage from '../components/StatusMessage';
import ImageUpload from '../components/ImageUpload';

const empty = { name: '', category: '', level: 50, iconUrl: '', displayOrder: 0 };

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/skills').then((res) => setSkills(res.data));

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'level' || name === 'displayOrder' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, form);
      } else {
        await api.post('/skills', form);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleEdit = (skill) => {
    setForm({ name: skill.name, category: skill.category || '', level: skill.level || 50, iconUrl: skill.iconUrl || '', displayOrder: skill.displayOrder || 0 });
    setEditingId(skill.id);
  };

  const handleCancel = () => {
    setForm(empty);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    await api.delete(`/skills/${id}`);
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Skills</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded border mb-6">
        <h2 className="font-semibold mb-3">{editingId ? 'Edit Skill' : 'Add Skill'}</h2>
        <StatusMessage error={error} />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border rounded px-3 py-2" />
          <div>
            <label className="block text-xs text-gray-500 mb-1">Level (0-100)</label>
            <input name="level" type="number" min="0" max="100" value={form.level} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Display Order</label>
            <input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
        <div className="col-span-2">
        <ImageUpload
            label="Icon Image"
            value={form.iconUrl}
            onChange={(url) => setForm({ ...form, iconUrl: url })}
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
        {skills.map((skill) => (
          <div key={skill.id} className="flex justify-between items-center p-3">
            <div>
              <p className="font-medium">{skill.name}</p>
              <p className="text-sm text-gray-500">{skill.category} · {skill.level}%</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(skill)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(skill.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {skills.length === 0 && <p className="p-4 text-gray-500 text-sm">No skills yet.</p>}
      </div>
    </div>
  );
}
