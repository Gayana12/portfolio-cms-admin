import { useState } from 'react';
import api from '../api/client';

export default function ImageUpload({ label, value, onChange }) {
  const [mode, setMode] = useState('upload'); // 'upload' or 'url'
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.url);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const previewSrc = value
    ? (value.startsWith('http') ? value : `http://localhost:8080${value}`)
    : null;

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {previewSrc && (
        <img
          src={previewSrc}
          alt=""
          className="w-24 h-24 object-cover rounded border mb-2"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      <div className="flex gap-3 mb-2 text-xs">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-2 py-1 rounded ${mode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Upload file
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-2 py-1 rounded ${mode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Paste URL
        </button>
      </div>

      {mode === 'upload' ? (
        <>
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleFileChange}
            className="text-sm"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        </>
      ) : (
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          value={value && value.startsWith('http') ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
