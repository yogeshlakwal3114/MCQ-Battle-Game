const express = require('express');
const router = express.Router();
const { updateAccuracy, getAccuracyByEmail } = require('../Controller/AccuracyController');

// POST endpoint to update accuracy
router.post('/', updateAccuracy);
router.get('/:email', getAccuracyByEmail);

module.exports = router;
