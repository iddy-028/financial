const Transaction = require('../models/Transaction');

exports.getAll = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      categoryId: req.query.categoryId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      month: req.query.month,
      year: req.query.year,
      limit: req.query.limit
    };
    const transactions = await Transaction.findByUserId(req.user.id, filters);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { categoryId, type, amount, description, date } = req.body;
    if (!type || !amount || !date) {
      return res.status(400).json({ message: 'Type, amount, and date are required' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
    }
    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    const id = await Transaction.create(req.user.id, categoryId || null, type, parseFloat(amount), description, date);
    res.status(201).json({ id, message: 'Transaction created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { categoryId, type, amount, description, date } = req.body;
    const transaction = await Transaction.findById(req.params.id, req.user.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    await Transaction.update(req.params.id, req.user.id, categoryId, type, parseFloat(amount), description, date);
    res.json({ message: 'Transaction updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id, req.user.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    await Transaction.delete(req.params.id, req.user.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
