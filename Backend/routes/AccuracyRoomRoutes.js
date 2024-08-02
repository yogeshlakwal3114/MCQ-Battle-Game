const express = require('express');
const router = express.Router();
const accuracyController = require('../Controller/AccuracyRoomController');

// Create a new accuracy record
router.post('/', accuracyController.createAccuracy);

// Read an accuracy record by email
router.get('/:email', accuracyController.getAccuracyByEmail);

//Get all data
router.get('/', accuracyController.getAccuracy);

// Update an accuracy record
router.put('/:email', accuracyController.updateAccuracy);

// Delete an accuracy record
router.delete('/:email', accuracyController.deleteAccuracy);

// Increment win or loss
router.put('/incrementCounts/:email', accuracyController.incrementCounts);

module.exports = router;
