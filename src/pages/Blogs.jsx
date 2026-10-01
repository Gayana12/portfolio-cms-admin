import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusMessage from '../components/StatusMessage';
import ImageUpload from '../components/ImageUpload';

const empty = {
  title: '', excerpt: '', content: '', coverImageUrl: '', tags: '', published: false,
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/admin/blogs').then((res) => setBlogs(res.data));

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
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, payload);
      } else {
        await api.post('/blogs', payload);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleEdit = (b) => {
    setForm({
      title: b.title, excerpt: b.excerpt || '', content: b.content || '',
      coverImageUrl: b.coverImageUrl || '', tags: (b.tags || []).join(', '), published: b.published,
    });
    setEditingId(b.id);
  };

  const handleCancel = () => {
    setForm(empty);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    await api.delete(`/blogs/${id}`);
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Blogs</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded border mb-6">
        <h2 className="font-semibold mb-3">{editingId ? 'Edit Post' : 'Add Post'}</h2>
        <StatusMessage error={error} />
        <div className="space-y-3 mb-3">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <input name="excerpt" placeholder="Excerpt" value={form.excerpt} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} rows={6} className="w-full border rounded px-3 py-2" />
          <ImageUpload
            label="Cover Image"
            value={form.coverImageUrl}
            onChange={(url) => setForm({ ...form, coverImageUrl: url })}
          />
          <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} /> Published
          </label>
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
        {blogs.map((b) => (
          <div key={b.id} className="flex justify-between items-center p-3">
            <div>
              <p className="font-medium">
                {b.title} {b.published ? '' : <span className="text-xs text-orange-600">(draft)</span>}
              </p>
              <p className="text-sm text-gray-500">/{b.slug}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(b)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <p className="p-4 text-gray-500 text-sm">No posts yet.</p>}
      </div>
    </div>
  );
}
