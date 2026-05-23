import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api.js';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/login', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      const redirectPath = response.data.user.role === 'admin' ? '/admin' : '/';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in to your account</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your credentials to continue.</p>
        {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-2 w-full" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="mt-2 w-full" required />
          </label>
          <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Login</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account? <Link to="/register" className="text-sky-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
