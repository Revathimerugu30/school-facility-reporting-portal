import Issue from '../models/Issue.js';

export const getStats = async (req, res) => {
  try {
    // Use aggregation pipeline for faster calculations
    const statsResult = await Issue.aggregate([
      {
        $facet: {
          counts: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                pending: {
                  $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
                },
                progress: {
                  $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] },
                },
                resolved: {
                  $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] },
                },
                highPriority: {
                  $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] },
                },
              },
            },
          ],
          statusDistribution: [
            {
              $group: {
                _id: '$status',
                value: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                name: '$_id',
                value: 1,
              },
            },
          ],
          categoryDistribution: [
            {
              $group: {
                _id: '$category',
                value: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                name: '$_id',
                value: 1,
              },
            },
          ],
          recentIssues: [
            { $sort: { createdAt: -1 } },
            { $limit: 6 },
            {
              $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
              },
            },
            {
              $unwind: {
                path: '$createdBy',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                priority: 1,
                status: 1,
                category: 1,
                createdAt: 1,
                'createdBy.name': 1,
                'createdBy.role': 1,
              },
            },
          ],
        },
      },
    ]);

    const stats = statsResult[0];
    const counts = stats.counts[0] || {
      total: 0,
      pending: 0,
      progress: 0,
      resolved: 0,
      highPriority: 0,
    };

    res.json({
      total: counts.total,
      pending: counts.pending,
      progress: counts.progress,
      resolved: counts.resolved,
      highPriority: counts.highPriority,
      statusDistribution: stats.statusDistribution,
      categoryDistribution: stats.categoryDistribution,
      recentIssues: stats.recentIssues.map((issue) => ({
        _id: issue._id,
        title: issue.title,
        priority: issue.priority,
        status: issue.status,
        category: issue.category,
        createdBy: issue.createdBy,
      })),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to load stats',
      total: 0,
      pending: 0,
      progress: 0,
      resolved: 0,
      highPriority: 0,
      statusDistribution: [],
      categoryDistribution: [],
      recentIssues: [],
    });
  }
};
