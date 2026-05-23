import { useEffect, useState } from 'react';
import api from '../api/api.js';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', schoolId: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/users/me');
        const updatedUser = response.data;
        setUser(updatedUser);
        setForm({ name: updatedUser.name, email: updatedUser.email, schoolId: updatedUser.schoolId, password: '' });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (_) {
        const data = localStorage.getItem('user');
        if (data) {
          const parsed = JSON.parse(data);
          setUser(parsed);
          setForm({ name: parsed.name, email: parsed.email, schoolId: parsed.schoolId, password: '' });
        }
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/me', form);
      setMessage('Profile updated successfully.');
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setForm({ name: updatedUser.name, email: updatedUser.email, schoolId: updatedUser.schoolId, password: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to update profile');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-2 text-sm text-slate-500">Update your account information and view your current role.</p>
      </div>

      <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user?.name}</p>
          <p className="mt-4 text-sm text-slate-500">Email</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user?.email}</p>
          <p className="mt-4 text-sm text-slate-500">Role</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user?.role}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-700">{message}</div>}
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input name="name" value={form.name} onChange={handleChange} className="mt-2 w-full" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-2 w-full" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">School ID</span>
            <input name="schoolId" value={form.schoolId} onChange={handleChange} className="mt-2 w-full" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">New Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="mt-2 w-full" />
          </label>
          <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
