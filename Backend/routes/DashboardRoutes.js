const express = require('express');
const router = express.Router();

const { createOrUpdateDashboard, getDashboards, getDashboardByEmail } = require('../Controller/DashboardController');

router.post('/', createOrUpdateDashboard);
router.get('/', getDashboards);
router.get('/:email', getDashboardByEmail);

module.exports = router;
