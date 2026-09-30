import { useEffect, useState } from 'react';
import api from '../api/client';
import StatusMessage from '../components/StatusMessage';
import ImageUpload from '../components/ImageUpload';

const empty = {
  fullName: '', headline: '', bio: '', profileImageUrl: '', resumeUrl: '',
  email: '', phone: '', location: '', githubUrl: '', linkedinUrl: '', twitterUrl: '',
};

export default function About() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/about')
      .then((res) => setForm({ ...empty, ...res.data }))
      .catch(() => {}) // no About record yet, keep the empty form
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.put('/about', form);
      setSuccess('Saved successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    }
  };

  if (loading) return <p>Loading...</p>;

  const fields = [
    ['fullName', 'Full Name'], ['headline', 'Headline'], ['email', 'Email'],
    ['phone', 'Phone'], ['location', 'Location'],
    ['resumeUrl', 'Resume URL'], ['githubUrl', 'GitHub URL'],
    ['linkedinUrl', 'LinkedIn URL'], ['twitterUrl', 'Twitter URL'],
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">About</h1>
      <StatusMessage error={error} success={success} />
      <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUpload
          label="Profile Image"
          value={form.profileImageUrl}
          onChange={(url) => setForm({ ...form, profileImageUrl: url })}
        />
        {fields.map(([name, label]) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              name={name}
              value={form[name] || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio || ''}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save
        </button>
      </form>
    </div>
  );
}
