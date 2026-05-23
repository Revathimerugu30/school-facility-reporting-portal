import { useEffect, useState } from 'react';
import IssueCard from '../components/IssueCard.jsx';
import api from '../api/api.js';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', status: '' });

  useEffect(() => {
    const loadIssues = async () => {
      const query = new URLSearchParams();
      if (filters.search) query.set('search', filters.search);
      if (filters.category) query.set('category', filters.category);
      if (filters.status) query.set('status', filters.status);
      const response = await api.get(`/issues?${query.toString()}`);
      setIssues(response.data);
    };
    loadIssues();
  }, [filters]);

  const handleChange = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Issue tracking</h1>
        <p className="mt-2 text-sm text-slate-500">Search, filter, and monitor facility repair requests.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input name="search" value={filters.search} onChange={handleChange} placeholder="Search issues" className="w-full" />
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
      </div>

      <div className="grid gap-4">
        {issues.length > 0 ? issues.map((issue) => <IssueCard key={issue._id} issue={issue} />) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">No issues found.</div>
        )}
      </div>
    </div>
  );
};

export default Issues;
