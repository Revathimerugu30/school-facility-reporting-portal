const DashboardCard = ({ title, value, color }) => {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${color}`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
};

export default DashboardCard;
