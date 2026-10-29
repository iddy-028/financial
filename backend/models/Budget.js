const db = require('../config/db');

class Budget {
  static async createOrUpdate(userId, categoryId, amount, month, year) {
    const [result] = await db.query(
      `INSERT INTO budgets (user_id, category_id, amount, month, year)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE amount = VALUES(amount), updated_at = NOW()`,
      [userId, categoryId, amount, month, year]
    );
    return result.insertId;
  }

  static async findByUserId(userId, month, year) {
    const [rows] = await db.query(
      `SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon,
       COALESCE(
         (SELECT SUM(t.amount)
          FROM transactions t
          WHERE t.user_id = b.user_id
          AND t.category_id = b.category_id
          AND t.type = 'expense'
          AND MONTH(t.transaction_date) = b.month
          AND YEAR(t.transaction_date) = b.year),
         0
       ) as spent
       FROM budgets b
       LEFT JOIN categories c ON b.category_id = c.id
       WHERE b.user_id = ? AND b.month = ? AND b.year = ?
       ORDER BY c.name ASC`,
      [userId, month, year]
    );
    return rows;
  }

  static async getOverallBudget(userId, month, year) {
    const [rows] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total_budget
       FROM budgets
       WHERE user_id = ? AND month = ? AND year = ?`,
      [userId, month, year]
    );

    const [spent] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total_spent
       FROM transactions
       WHERE user_id = ? AND type = 'expense' AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?`,
      [userId, month, year]
    );

    return {
      total_budget: parseFloat(rows[0].total_budget),
      total_spent: parseFloat(spent[0].total_spent),
      remaining: parseFloat(rows[0].total_budget) - parseFloat(spent[0].total_spent),
      percentage: parseFloat(rows[0].total_budget) > 0
        ? Math.round((parseFloat(spent[0].total_spent) / parseFloat(rows[0].total_budget)) * 100)
        : 0
    };
  }

  static async findById(id, userId) {
    const [rows] = await db.query(
      'SELECT * FROM budgets WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  }

  static async delete(id, userId) {
    await db.query('DELETE FROM budgets WHERE id = ? AND user_id = ?', [id, userId]);
  }
}

module.exports = Budget;
