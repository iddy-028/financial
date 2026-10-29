const express = require('express');
const router = express.Router();
const { getAll, getUnreadCount, markAsRead, markAllAsRead, remove, checkBudgetAlerts } = require('../controllers/alertController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', getAll);
router.get('/unread-count', getUnreadCount);
router.post('/check-budgets', checkBudgetAlerts);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', remove);

module.exports = router;
