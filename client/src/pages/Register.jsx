import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api.js';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', schoolId: '', role: 'teacher' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/register', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      const redirectPath = response.data.user.role === 'admin' ? '/admin' : '/';
      navigate(redirectPath);
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message === 'Email already registered' ? 'Email already registered. Please login.' : message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Join the portal to report and track facility issues.</p>
        {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Full Name</span>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="mt-2 w-full" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">School ID</span>
            <input type="text" name="schoolId" value={form.schoolId} onChange={handleChange} className="mt-2 w-full" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-2 w-full" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="mt-2 w-full" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select name="role" value={form.role} onChange={handleChange} className="mt-2 w-full">
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Register</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link to="/login" className="text-sky-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
