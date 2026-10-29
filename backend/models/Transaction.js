const db = require('../config/db');

class Transaction {
  static async create(userId, categoryId, type, amount, description, date) {
    const [result] = await db.query(
      'INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, categoryId, type, amount, description, date]
    );
    return result.insertId;
  }

  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (filters.type) {
      query += ' AND t.type = ?';
      params.push(filters.type);
    }
    if (filters.categoryId) {
      query += ' AND t.category_id = ?';
      params.push(filters.categoryId);
    }
    if (filters.startDate) {
      query += ' AND t.transaction_date >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND t.transaction_date <= ?';
      params.push(filters.endDate);
    }
    if (filters.month && filters.year) {
      query += ' AND MONTH(t.transaction_date) = ? AND YEAR(t.transaction_date) = ?';
      params.push(filters.month, filters.year);
    }

    query += ' ORDER BY t.transaction_date DESC, t.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id, userId) {
    const [rows] = await db.query(
      `SELECT t.*, c.name as category_name, c.color as category_color
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ? AND t.user_id = ?`,
      [id, userId]
    );
    return rows[0] || null;
  }

  static async update(id, userId, categoryId, type, amount, description, date) {
    await db.query(
      'UPDATE transactions SET category_id = ?, type = ?, amount = ?, description = ?, transaction_date = ? WHERE id = ? AND user_id = ?',
      [categoryId, type, amount, description, date, id, userId]
    );
  }

  static async delete(id, userId) {
    await db.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
  }

  static async getSummary(userId, month, year) {
    const [income] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = ? AND type = 'income' AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?`,
      [userId, month, year]
    );

    const [expense] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = ? AND type = 'expense' AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?`,
      [userId, month, year]
    );

    return {
      income: parseFloat(income[0].total),
      expense: parseFloat(expense[0].total),
      balance: parseFloat(income[0].total) - parseFloat(expense[0].total)
    };
  }

  static async getCategoryBreakdown(userId, month, year) {
    const [rows] = await db.query(
      `SELECT c.name, c.color, c.icon, COALESCE(SUM(t.amount), 0) as total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? AND t.type = 'expense' AND MONTH(t.transaction_date) = ? AND YEAR(t.transaction_date) = ?
       GROUP BY c.id, c.name, c.color, c.icon
       ORDER BY total DESC`,
      [userId, month, year]
    );
    return rows;
  }

  static async getDailyTrend(userId, month, year) {
    const [rows] = await db.query(
      `SELECT
         DAY(transaction_date) as day,
         type,
         COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = ? AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?
       GROUP BY DAY(transaction_date), type
       ORDER BY day ASC`,
      [userId, month, year]
    );
    return rows;
  }

  static async getMonthlyTrend(userId, year) {
    const [rows] = await db.query(
      `SELECT
         MONTH(transaction_date) as month,
         type,
         COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = ? AND YEAR(transaction_date) = ?
       GROUP BY MONTH(transaction_date), type
       ORDER BY month ASC`,
      [userId, year]
    );
    return rows;
  }
}

module.exports = Transaction;
