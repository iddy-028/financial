const db = require('../config/db');

class Alert {
  static async create(userId, message) {
    const [result] = await db.query(
      'INSERT INTO alerts (user_id, message) VALUES (?, ?)',
      [userId, message]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      'SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async findUnreadByUserId(userId) {
    const [rows] = await db.query(
      'SELECT * FROM alerts WHERE user_id = ? AND status = ? ORDER BY created_at DESC',
      [userId, 'unread']
    );
    return rows;
  }

  static async countUnread(userId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND status = ?',
      [userId, 'unread']
    );
    return rows[0].count;
  }

  static async markAsRead(id, userId) {
    await db.query(
      'UPDATE alerts SET status = ? WHERE id = ? AND user_id = ?',
      ['read', id, userId]
    );
  }

  static async markAllAsRead(userId) {
    await db.query(
      'UPDATE alerts SET status = ? WHERE user_id = ? AND status = ?',
      ['read', userId, 'unread']
    );
  }

  static async delete(id, userId) {
    await db.query('DELETE FROM alerts WHERE id = ? AND user_id = ?', [id, userId]);
  }

  static async checkBudgetAlerts(userId) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [budgets] = await db.query(
      `SELECT b.*, c.name as category_name,
       COALESCE(
         (SELECT SUM(t.amount) FROM transactions t 
          WHERE t.user_id = b.user_id 
          AND t.category_id = b.category_id 
          AND t.type = 'expense' 
          AND MONTH(t.date) = b.month 
          AND YEAR(t.date) = b.year), 0
       ) as spent
       FROM budgets b
       LEFT JOIN categories c ON b.category_id = c.id
       WHERE b.user_id = ? AND b.month = ? AND b.year = ?`,
      [userId, month, year]
    );

    for (const budget of budgets) {
      const percentage = budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0;
      const categoryName = budget.category_name || 'Overall';

      if (percentage >= 100) {
        const existing = await db.query(
          'SELECT id FROM alerts WHERE user_id = ? AND message LIKE ? AND MONTH(created_at) = ? AND YEAR(created_at) = ?',
          [userId, `%${categoryName}%budget exceeded%`, month, year]
        );
        if (existing[0].length === 0) {
          await Alert.create(userId, `You have exceeded your ${categoryName} budget by RWF ${(budget.spent - budget.amount).toFixed(2)}`);
        }
      } else if (percentage >= 80) {
        const existing = await db.query(
          'SELECT id FROM alerts WHERE user_id = ? AND message LIKE ? AND MONTH(created_at) = ? AND YEAR(created_at) = ?',
          [userId, `%${categoryName}%approaching%`, month, year]
        );
        if (existing[0].length === 0) {
          await Alert.create(userId, `You are approaching your ${categoryName} budget limit (${percentage}% used)`);
        }
      }
    }
  }
}

module.exports = Alert;
