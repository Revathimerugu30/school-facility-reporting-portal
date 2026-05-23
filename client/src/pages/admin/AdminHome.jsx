import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../api/api.js';

const colors = ['#0ea5e9', '#f97316', '#22c55e', '#a855f7', '#eab308'];

const AdminHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    };
    loadStats();
  }, []);

  if (!stats) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading admin dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Issues</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats.pending}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats.progress}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Resolved</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats.resolved}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">High Priority</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats.highPriority}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Issue status distribution</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.statusDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Category distribution</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryDistribution} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent complaints</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 text-slate-900">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Reported By</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentIssues.map((issue) => (
                <tr key={issue._id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{issue.title}</td>
                  <td className="px-4 py-3">{issue.priority}</td>
                  <td className="px-4 py-3">{issue.status}</td>
                  <td className="px-4 py-3">{issue.category}</td>
                  <td className="px-4 py-3">{issue.createdBy?.name || 'Unknown'} {issue.createdBy?.role && `(${issue.createdBy.role.charAt(0).toUpperCase() + issue.createdBy.role.slice(1)})`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
