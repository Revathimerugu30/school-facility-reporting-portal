import { useRef, useState } from 'react';
import api from '../api/api.js';

const ReportIssue = () => {
  const [form, setForm] = useState({ title: '', description: '', category: 'Furniture', priority: 'Low', location: '' });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleImage = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append('image', image);

    try {
      await api.post('/issues/create', data);
      setMessage('Issue reported successfully!');
      setError('');
      setForm({ title: '', description: '', category: 'Furniture', priority: 'Low', location: '' });
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit issue');
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Report a new issue</h1>
        <p className="mt-2 text-sm text-slate-500">Create a detailed report so admin can assign repair staff faster.</p>
      </div>

      {message && <div className="rounded-3xl border border-slate-200 bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-3xl border border-slate-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Issue Title</span>
          <input name="title" value={form.title} onChange={handleChange} className="mt-2 w-full" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="mt-2 w-full" required />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select name="category" value={form.category} onChange={handleChange} className="mt-2 w-full">
              <option>Furniture</option>
              <option>Electrical</option>
              <option>Toilet</option>
              <option>Classroom</option>
              <option>Water</option>
              <option>Sanitation</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Priority</span>
            <select name="priority" value={form.priority} onChange={handleChange} className="mt-2 w-full">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Location</span>
          <input name="location" value={form.location} onChange={handleChange} className="mt-2 w-full" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Upload Image</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="mt-2 w-full" />
        </label>
        <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Submit Issue</button>
      </form>
    </div>
  );
};

export default ReportIssue;
