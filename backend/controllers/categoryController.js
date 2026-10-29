const Category = require('../models/Category');

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findByUserId(req.user.id);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
    }
    const id = await Category.create(req.user.id, name, type, color, icon);
    res.status(201).json({ id, message: 'Category created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    const category = await Category.findById(req.params.id, req.user.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await Category.update(req.params.id, req.user.id, name, type, color, icon);
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id, req.user.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const txCount = await Category.countTransactions(req.params.id);
    if (txCount > 0) {
      return res.status(400).json({ message: 'Cannot delete category with existing transactions' });
    }
    await Category.delete(req.params.id, req.user.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
