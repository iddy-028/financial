const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('Starting database seed...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Insert sample users
    await db.query(`
      INSERT INTO users (name, email, password, role) VALUES
      ('Admin User', 'admin@example.com', ?, 'admin'),
      ('John Doe', 'john@example.com', ?, 'user'),
      ('Jane Smith', 'jane@example.com', ?, 'user')
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `, [adminPassword, userPassword, userPassword]);
    console.log('✓ Users seeded');

    // Get user IDs
    const [users] = await db.query('SELECT id, email FROM users');
    const userMap = {};
    users.forEach(u => { userMap[u.email] = u.id; });

    const johnId = userMap['john@example.com'];
    const janeId = userMap['jane@example.com'];

    // Insert sample categories for John
    await db.query(`
      INSERT INTO categories (user_id, name, type, color, icon) VALUES
      (?, 'Salary', 'income', '#22c55e', 'briefcase'),
      (?, 'Freelance', 'income', '#10b981', 'code'),
      (?, 'Food & Dining', 'expense', '#ef4444', 'utensils'),
      (?, 'Transportation', 'expense', '#f97316', 'car'),
      (?, 'Rent', 'expense', '#8b5cf6', 'home'),
      (?, 'Entertainment', 'expense', '#ec4899', 'film'),
      (?, 'Utilities', 'expense', '#3b82f6', 'bolt'),
      (?, 'Shopping', 'expense', '#f59e0b', 'shopping-bag')
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `, [johnId, johnId, johnId, johnId, johnId, johnId, johnId, johnId]);
    console.log('✓ Categories for John seeded');

    // Insert sample categories for Jane
    await db.query(`
      INSERT INTO categories (user_id, name, type, color, icon) VALUES
      (?, 'Consulting', 'income', '#22c55e', 'briefcase'),
      (?, 'Investments', 'income', '#10b981', 'trending-up'),
      (?, 'Groceries', 'expense', '#ef4444', 'shopping-cart'),
      (?, 'Healthcare', 'expense', '#f97316', 'heart'),
      (?, 'Housing', 'expense', '#8b5cf6', 'home'),
      (?, 'Education', 'expense', '#ec4899', 'book'),
      (?, 'Subscriptions', 'expense', '#3b82f6', 'tv')
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `, [janeId, janeId, janeId, janeId, janeId, janeId, janeId]);
    console.log('✓ Categories for Jane seeded');

    // Get category IDs
    const [johnCats] = await db.query('SELECT id, name FROM categories WHERE user_id = ?', [johnId]);
    const [janeCats] = await db.query('SELECT id, name FROM categories WHERE user_id = ?', [janeId]);

    const getCatId = (cats, name) => {
      const cat = cats.find(c => c.name === name);
      return cat ? cat.id : null;
    };

    const johnSalary = getCatId(johnCats, 'Salary');
    const johnFreelance = getCatId(johnCats, 'Freelance');
    const johnFood = getCatId(johnCats, 'Food & Dining');
    const johnTransport = getCatId(johnCats, 'Transportation');
    const johnRent = getCatId(johnCats, 'Rent');
    const johnEntertainment = getCatId(johnCats, 'Entertainment');
    const johnUtilities = getCatId(johnCats, 'Utilities');
    const johnShopping = getCatId(johnCats, 'Shopping');

    const janeConsulting = getCatId(janeCats, 'Consulting');
    const janeInvestments = getCatId(janeCats, 'Investments');
    const janeGroceries = getCatId(janeCats, 'Groceries');
    const janeHealthcare = getCatId(janeCats, 'Healthcare');
    const janeHousing = getCatId(janeCats, 'Housing');
    const janeEducation = getCatId(janeCats, 'Education');
    const janeSubscriptions = getCatId(janeCats, 'Subscriptions');

    // Insert sample transactions for John
    await db.query(`
      INSERT INTO transactions (user_id, category_id, type, amount, description, date) VALUES
      (?, ?, 'income', 5000.00, 'Monthly salary - March', '2026-03-01'),
      (?, ?, 'income', 800.00, 'Freelance project - Website', '2026-03-05'),
      (?, ?, 'income', 1200.00, 'Freelance project - Mobile app', '2026-03-15'),
      (?, ?, 'expense', 150.00, 'Groceries and dining out', '2026-03-02'),
      (?, ?, 'expense', 85.50, 'Gas and Uber rides', '2026-03-03'),
      (?, ?, 'expense', 1200.00, 'Monthly rent payment', '2026-03-01'),
      (?, ?, 'expense', 45.00, 'Netflix and Spotify', '2026-03-05'),
      (?, ?, 'expense', 200.00, 'Electricity and internet', '2026-03-10'),
      (?, ?, 'expense', 120.00, 'New headphones', '2026-03-12'),
      (?, ?, 'expense', 75.00, 'Restaurant dinner', '2026-03-15'),
      (?, ?, 'expense', 95.00, 'Weekly groceries', '2026-03-18'),
      (?, ?, 'expense', 60.00, 'Movie tickets', '2026-03-20'),
      (?, ?, 'expense', 180.00, 'Clothing purchase', '2026-03-22'),
      (?, ?, 'expense', 45.00, 'Gas refill', '2026-03-25')
      ON DUPLICATE KEY UPDATE description=VALUES(description)
    `, [
      johnId, johnSalary,
      johnId, johnFreelance,
      johnId, johnFreelance,
      johnId, johnFood,
      johnId, johnTransport,
      johnId, johnRent,
      johnId, johnEntertainment,
      johnId, johnUtilities,
      johnId, johnShopping,
      johnId, johnFood,
      johnId, johnFood,
      johnId, johnEntertainment,
      johnId, johnShopping,
      johnId, johnTransport
    ]);
    console.log('✓ Transactions for John seeded');

    // Insert sample transactions for Jane
    await db.query(`
      INSERT INTO transactions (user_id, category_id, type, amount, description, date) VALUES
      (?, ?, 'income', 3500.00, 'Consulting fee - March', '2026-03-01'),
      (?, ?, 'income', 500.00, 'Dividend payment', '2026-03-10'),
      (?, ?, 'expense', 280.00, 'Weekly groceries', '2026-03-03'),
      (?, ?, 'expense', 150.00, 'Doctor visit', '2026-03-07'),
      (?, ?, 'expense', 1500.00, 'Monthly mortgage', '2026-03-01'),
      (?, ?, 'expense', 350.00, 'Online course subscription', '2026-03-05'),
      (?, ?, 'expense', 45.00, 'Streaming services', '2026-03-05'),
      (?, ?, 'expense', 120.00, 'Grocery shopping', '2026-03-12'),
      (?, ?, 'expense', 75.00, 'Pharmacy', '2026-03-15'),
      (?, ?, 'expense', 95.00, 'Grocery run', '2026-03-19'),
      (?, ?, 'expense', 200.00, 'Books and materials', '2026-03-22'),
      (?, ?, 'expense', 65.00, 'Gym membership', '2026-03-25')
      ON DUPLICATE KEY UPDATE description=VALUES(description)
    `, [
      janeId, janeConsulting,
      janeId, janeInvestments,
      janeId, janeGroceries,
      janeId, janeHealthcare,
      janeId, janeHousing,
      janeId, janeEducation,
      janeId, janeSubscriptions,
      janeId, janeGroceries,
      janeId, janeHealthcare,
      janeId, janeGroceries,
      janeId, janeEducation,
      janeId, janeHealthcare
    ]);
    console.log('✓ Transactions for Jane seeded');

    // Insert sample budgets for John
    await db.query(`
      INSERT INTO budgets (user_id, category_id, amount, month, year) VALUES
      (?, NULL, 3000.00, 3, 2026),
      (?, ?, 400.00, 3, 2026),
      (?, ?, 300.00, 3, 2026),
      (?, ?, 1500.00, 3, 2026),
      (?, ?, 200.00, 3, 2026),
      (?, ?, 350.00, 3, 2026),
      (?, ?, 300.00, 3, 2026)
      ON DUPLICATE KEY UPDATE amount=VALUES(amount)
    `, [
      johnId,
      johnId, johnFood,
      johnId, johnTransport,
      johnId, johnRent,
      johnId, johnEntertainment,
      johnId, johnUtilities,
      johnId, johnShopping
    ]);
    console.log('✓ Budgets for John seeded');

    // Insert sample budgets for Jane
    await db.query(`
      INSERT INTO budgets (user_id, category_id, amount, month, year) VALUES
      (?, NULL, 2500.00, 3, 2026),
      (?, ?, 500.00, 3, 2026),
      (?, ?, 200.00, 3, 2026),
      (?, ?, 1600.00, 3, 2026),
      (?, ?, 400.00, 3, 2026),
      (?, ?, 100.00, 3, 2026)
      ON DUPLICATE KEY UPDATE amount=VALUES(amount)
    `, [
      janeId,
      janeId, janeGroceries,
      janeId, janeHealthcare,
      janeId, janeHousing,
      janeId, janeEducation,
      janeId, janeSubscriptions
    ]);
    console.log('✓ Budgets for Jane seeded');

    // Insert sample alerts
    await db.query(`
      INSERT INTO alerts (user_id, message, status) VALUES
      (?, 'You have spent 75% of your Food & Dining budget for March', 'unread'),
      (?, 'Your overall monthly budget has 35% remaining', 'unread'),
      (?, 'New feature: Budget reports are now available', 'read'),
      (?, 'You have exceeded your Groceries budget by $95', 'unread'),
      (?, 'Monthly budget summary is ready for review', 'read')
      ON DUPLICATE KEY UPDATE message=VALUES(message)
    `, [johnId, johnId, johnId, janeId, janeId]);
    console.log('✓ Alerts seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('  Admin: admin@example.com / admin123');
    console.log('  User:  john@example.com / user123');
    console.log('  User:  jane@example.com / user123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
