const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

exports.getMonthlyReport = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const [summary, categoryBreakdown, dailyTrend, budgetData] = await Promise.all([
      Transaction.getSummary(req.user.id, month, year),
      Transaction.getCategoryBreakdown(req.user.id, month, year),
      Transaction.getDailyTrend(req.user.id, month, year),
      Budget.findByUserId(req.user.id, month, year)
    ]);

    res.json({
      summary,
      categoryBreakdown,
      dailyTrend,
      budgets: budgetData,
      month,
      year
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getYearlyReport = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const monthlyTrend = await Transaction.getMonthlyTrend(req.user.id, year);
    res.json({ monthlyTrend, year });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
