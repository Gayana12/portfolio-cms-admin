import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusMessage from '../components/StatusMessage';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps/Cloud', 'Tools', 'Languages', 'Other'];

const empty = { name: '', category: '', description: '', level: 50 };

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/skills').then((res) => setSkills(res.data));

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'level' ? Number(value) : value });
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
    setForm({
      name: skill.name,
      category: skill.category || '',
      description: skill.description || '',
      level: skill.level ?? 50,
    });
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
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="border rounded px-3 py-2 w-full">
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Level (0-100)</label>
            <input name="level" type="number" min="0" max="100" value={form.level} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="border rounded px-3 py-2 w-full" />
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
              {skill.description && <p className="text-xs text-gray-400 mt-1">{skill.description}</p>}
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
