import Issue from '../models/Issue.js';

export const getStats = async (req, res) => {
  const issues = await Issue.find().populate('createdBy', 'name email');

  const total = issues.length;
  const pending = issues.filter((issue) => issue.status === 'Pending').length;
  const progress = issues.filter((issue) => issue.status === 'In Progress').length;
  const resolved = issues.filter((issue) => issue.status === 'Resolved').length;
  const highPriority = issues.filter((issue) => issue.priority === 'High').length;

  const statusDistribution = [
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: progress },
    { name: 'Resolved', value: resolved },
  ];

  const categoryCounts = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {});

  const categoryDistribution = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const recentIssues = issues
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  res.json({
    total,
    pending,
    progress,
    resolved,
    highPriority,
    statusDistribution,
    categoryDistribution,
    recentIssues,
  });
};
