const express = require('express');
const router = express.Router();
const { getHelplines, getHelplineById } = require('../controllers/helplineController');

router.get('/', getHelplines);
router.get('/:id', getHelplineById);

module.exports = router;
