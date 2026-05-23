import { useEffect, useState } from 'react';
import IssueCard from '../components/IssueCard.jsx';
import api from '../api/api.js';

const AdminPanel = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const loadIssues = async () => {
      const response = await api.get('/issues');
      setIssues(response.data);
    };
    loadIssues();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Admin Panel</h1>
        <p className="mt-2 text-sm text-slate-500">Review all complaints, assign staff, and track issue progress.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Total reports</h2>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{issues.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Pending reports</h2>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{issues.filter((issue) => issue.status === 'Pending').length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">In progress</h2>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{issues.filter((issue) => issue.status === 'In Progress').length}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {issues.length > 0 ? issues.map((issue) => <IssueCard key={issue._id} issue={issue} />) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">No issues available.</div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
