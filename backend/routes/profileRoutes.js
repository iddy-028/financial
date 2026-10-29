const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', changePassword);

module.exports = router;
