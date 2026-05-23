import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

export const markRead = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findOne({ _id: id, userId: req.user._id });
  if (!notification) return res.status(404).json({ error: 'Notification not found' });

  notification.readStatus = true;
  await notification.save();
  res.json({ message: 'Notification marked as read' });
};
