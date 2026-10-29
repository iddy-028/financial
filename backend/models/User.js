const db = require('../config/db');

class User {
  static async create(name, email, hashedPassword) {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async updateProfile(id, name, email) {
    await db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
  }

  static async updatePassword(id, hashedPassword) {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  }

  static async findAll() {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  static async deleteById(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = User;
