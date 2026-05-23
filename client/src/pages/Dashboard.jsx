import { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DashboardCard from '../components/DashboardCard.jsx';
import api from '../api/api.js';

const colors = ['#0ea5e9', '#f97316', '#14b8a6', '#2dd4bf', '#a855f7'];

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, progress: 0, resolved: 0 });
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await api.get('/issues');
      const items = response.data;
      setIssues(items);
      setStats({
        total: items.length,
        pending: items.filter((item) => item.status === 'Pending').length,
        progress: items.filter((item) => item.status === 'In Progress').length,
        resolved: items.filter((item) => item.status === 'Resolved').length,
      });
    };
    loadData();
  }, []);

  const categoryData = Object.entries(issues.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  const priorityData = Object.entries(issues.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Issues" value={stats.total} color="" />
        <DashboardCard title="Pending" value={stats.pending} color="" />
        <DashboardCard title="In Progress" value={stats.progress} color="" />
        <DashboardCard title="Resolved" value={stats.resolved} color="" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Issue categories</h2>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Priority distribution</h2>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
    </div>
  );
};

export default Dashboard;
