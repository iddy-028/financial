const express = require('express');
const router = express.Router();
const { getAll, getOverall, upsert, remove } = require('../controllers/budgetController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', getAll);
router.get('/overall', getOverall);
router.post('/', upsert);
router.delete('/:id', remove);

module.exports = router;
