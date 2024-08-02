const express = require('express');
const { createOrUpdateReview, getAllReviews } = require('../Controller/ReviewController');
const router = express.Router();

router.post('/', createOrUpdateReview);
router.get('/', getAllReviews);

module.exports = router;
