import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusMessage from '../components/StatusMessage';
import ImageUpload from '../components/ImageUpload';

const empty = {
  title: '', description: '', imageUrl: '', githubUrl: '', liveUrl: '',
  technologies: '', featured: false, published: false, displayOrder: 0,
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // admin list includes drafts, unlike the public /api/projects
  const load = () => api.get('/admin/projects').then((res) => setProjects(res.data));

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      displayOrder: Number(form.displayOrder),
    };
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title, description: p.description || '', imageUrl: p.imageUrl || '',
      githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '',
      technologies: (p.technologies || []).join(', '),
      featured: p.featured, published: p.published, displayOrder: p.displayOrder || 0,
    });
    setEditingId(p.id);
  };

  const handleCancel = () => {
    setForm(empty);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded border mb-6">
        <h2 className="font-semibold mb-3">{editingId ? 'Edit Project' : 'Add Project'}</h2>
        <StatusMessage error={error} />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} className="border rounded px-3 py-2 col-span-2" />
          <input name="githubUrl" placeholder="GitHub URL" value={form.githubUrl} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="liveUrl" placeholder="Live URL" value={form.liveUrl} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="technologies" placeholder="Technologies (comma-separated)" value={form.technologies} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" />
          <input name="displayOrder" type="number" placeholder="Display Order" value={form.displayOrder} onChange={handleChange} className="border rounded px-3 py-2" />
          <div className="col-span-2">
            <ImageUpload
                label="Project Image"
                value={form.imageUrl}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} /> Published
            </label>
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
        {projects.map((p) => (
          <div key={p.id} className="flex justify-between items-center p-3">
            <div>
              <p className="font-medium">
                {p.title} {p.published ? '' : <span className="text-xs text-orange-600">(draft)</span>}
              </p>
              <p className="text-sm text-gray-500">{(p.technologies || []).join(', ')}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="p-4 text-gray-500 text-sm">No projects yet.</p>}
      </div>
    </div>
  );
}
