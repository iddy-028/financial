const db = require('../config/db');

class Category {
  static async create(userId, name, type, color = '#6366f1', icon = 'folder') {
    const [result] = await db.query(
      'INSERT INTO categories (user_id, name, type, color, icon) VALUES (?, ?, ?, ?, ?)',
      [userId, name, type, color, icon]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC',
      [userId]
    );
    return rows;
  }

  static async findById(id, userId) {
    const [rows] = await db.query(
      'SELECT * FROM categories WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  }

  static async update(id, userId, name, type, color, icon) {
    await db.query(
      'UPDATE categories SET name = ?, type = ?, color = ?, icon = ? WHERE id = ? AND user_id = ?',
      [name, type, color, icon, id, userId]
    );
  }

  static async delete(id, userId) {
    await db.query('DELETE FROM categories WHERE id = ? AND user_id = ?', [id, userId]);
  }

  static async countTransactions(categoryId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
      [categoryId]
    );
    return rows[0].count;
  }
}

module.exports = Category;
