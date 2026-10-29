const Alert = require('../models/Alert');

exports.getAll = async (req, res) => {
  try {
    const alerts = await Alert.findByUserId(req.user.id);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Alert.countUnread(req.user.id);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Alert.markAsRead(req.params.id, req.user.id);
    res.json({ message: 'Alert marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Alert.markAllAsRead(req.user.id);
    res.json({ message: 'All alerts marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Alert.delete(req.params.id, req.user.id);
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.checkBudgetAlerts = async (req, res) => {
  try {
    await Alert.checkBudgetAlerts(req.user.id);
    res.json({ message: 'Budget alerts checked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
