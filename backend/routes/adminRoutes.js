const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/adminController');
const auth = require('../middleware/auth');

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

router.use(auth);
router.use(adminAuth);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
