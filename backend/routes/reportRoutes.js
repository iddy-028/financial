const express = require('express');
const router = express.Router();
const { getMonthlyReport, getYearlyReport } = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/monthly', getMonthlyReport);
router.get('/yearly', getYearlyReport);

module.exports = router;
