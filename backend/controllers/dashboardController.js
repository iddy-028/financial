const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

exports.getDashboard = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const [summary, categoryBreakdown, overallBudget, recentTransactions] = await Promise.all([
      Transaction.getSummary(req.user.id, month, year),
      Transaction.getCategoryBreakdown(req.user.id, month, year),
      Budget.getOverallBudget(req.user.id, month, year),
      Transaction.findByUserId(req.user.id, { limit: 10 })
    ]);

    res.json({
      summary,
      categoryBreakdown,
      budget: overallBudget,
      recentTransactions,
      month,
      year
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
