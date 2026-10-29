const Budget = require('../models/Budget');

exports.getAll = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const budgets = await Budget.findByUserId(req.user.id, month, year);
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOverall = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const overall = await Budget.getOverallBudget(req.user.id, month, year);
    res.json(overall);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.upsert = async (req, res) => {
  try {
    const { categoryId, amount, month, year } = req.body;
    if (!amount || !month || !year) {
      return res.status(400).json({ message: 'Amount, month, and year are required' });
    }
    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    await Budget.createOrUpdate(req.user.id, categoryId || null, parseFloat(amount), month, year);
    res.json({ message: 'Budget saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id, req.user.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    await Budget.delete(req.params.id, req.user.id);
    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
