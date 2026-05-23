import placeholder from '../assets/placeholder.svg';

const getIssueImageUrl = (image) => {
  if (!image) return placeholder;

  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
  if (image.startsWith('http')) return image;
  return `${backendBase}${image.startsWith('/') ? '' : '/'}${image}`;
};

const IssueCard = ({ issue }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <img
              src={getIssueImageUrl(issue.image)}
              alt={issue.title || 'issue image'}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = placeholder; }}
              className="h-24 w-36 rounded-lg object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{issue.title}</h3>
            <p className="text-sm text-slate-500">{issue.category} · {issue.priority} Priority</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : issue.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
        }`}>
          {issue.status}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-600">{issue.description}</p>
      <div className="mt-4 text-sm text-slate-500">
        <p><span className="font-semibold">Location:</span> {issue.location}</p>
        <p><span className="font-semibold">Assigned:</span> {issue.assignedStaff || 'Unassigned'}</p>
      </div>
    </div>
  );
};

export default IssueCard;
