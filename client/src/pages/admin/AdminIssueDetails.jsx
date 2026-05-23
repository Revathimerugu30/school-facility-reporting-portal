import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api.js';
import placeholder from '../../assets/placeholder.svg';

const AdminIssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [form, setForm] = useState({ status: '', assignedStaff: '' });

  useEffect(() => {
    const loadIssue = async () => {
      const response = await api.get(`/issues/${id}`);
      setIssue(response.data);
      setForm({ status: response.data.status, assignedStaff: response.data.assignedStaff || '' });
    };
    loadIssue();
  }, [id]);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleUpdate = async () => {
    await api.put(`/issues/${id}`, {
      status: form.status,
      assignedStaff: form.assignedStaff,
    });
    navigate('/admin/manage');
  };

  const handleDelete = async () => {
    await api.delete(`/issues/${id}`);
    navigate('/admin/manage');
  };

  if (!issue) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading issue details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Issue Details</h1>
        <p className="mt-2 text-sm text-slate-500">Review the complaint, update status, and assign repair staff.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{issue.title}</h2>
          <p className="mt-3 text-sm text-slate-500">{issue.description}</p>
          <div className="mt-6 text-sm text-slate-600 space-y-2">
            <p><strong>Location:</strong> {issue.location}</p>
            <p><strong>Category:</strong> {issue.category}</p>
            <p><strong>Priority:</strong> {issue.priority}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <p><strong>Reported By:</strong> {issue.createdBy?.name || 'Unknown'} {issue.createdBy?.role && `(${issue.createdBy.role.charAt(0).toUpperCase() + issue.createdBy.role.slice(1)})`}</p>
            <p><strong>Reported At:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
          </div>
          <img
            src={issue.image || placeholder}
            alt={issue.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = placeholder; }}
            className="mt-6 h-72 w-full rounded-3xl object-cover"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Update Status</h2>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full">
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Assigned Staff</span>
            <input name="assignedStaff" value={form.assignedStaff} onChange={handleChange} className="mt-2 w-full" placeholder="Maintenance Team A" />
          </label>
          <button onClick={handleUpdate} className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Save changes</button>
          <button onClick={handleDelete} className="mt-3 w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700">Delete issue</button>
        </div>
      </div>
    </div>
  );
};

export default AdminIssueDetails;
