import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api.js';

const AdminManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', status: '', priority: '' });

  useEffect(() => {
    const loadIssues = async () => {
      const query = new URLSearchParams();
      if (filters.search) query.set('search', filters.search);
      if (filters.category) query.set('category', filters.category);
      if (filters.status) query.set('status', filters.status);
      if (filters.priority) query.set('priority', filters.priority);
      const response = await api.get(`/issues?${query.toString()}`);
      setIssues(response.data);
    };

    loadIssues();
  }, [filters]);

  const handleChange = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Manage Issues</h1>
        <p className="mt-2 text-sm text-slate-500">Search, filter, and update repair requests from all users.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <input name="search" value={filters.search} onChange={handleChange} placeholder="Search title or location" className="w-full" />
        <select name="category" value={filters.category} onChange={handleChange} className="w-full">
          <option value="">All categories</option>
          <option>Furniture</option>
          <option>Electrical</option>
          <option>Toilet</option>
          <option>Classroom</option>
          <option>Water</option>
          <option>Sanitation</option>
        </select>
        <select name="status" value={filters.status} onChange={handleChange} className="w-full">
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleChange} className="w-full">
          <option value="">All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <table className="min-w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 text-slate-900">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reported By</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3">{issue.title}</td>
                <td className="px-4 py-3">{issue.category}</td>
                <td className="px-4 py-3">{issue.priority}</td>
                <td className="px-4 py-3">{issue.status}</td>
                <td className="px-4 py-3">{issue.createdBy?.name || 'Unknown'} {issue.createdBy?.role && `(${issue.createdBy.role.charAt(0).toUpperCase() + issue.createdBy.role.slice(1)})`}</td>
                <td className="px-4 py-3">
                  <Link to={`/admin/issues/${issue._id}`} className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageIssues;
