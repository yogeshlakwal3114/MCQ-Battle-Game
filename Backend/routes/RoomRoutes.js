const express = require('express');
const router = express.Router();
const roomController = require('../Controller/roomRandomController');

// Create a new room
router.post('/create', roomController.createRoom);

// Get all rooms
router.get('/', roomController.getRooms);

router.get('/:roomId', roomController.getRoomById);

// Join a room
router.post('/join', roomController.joinRoom);

// Delete a room
router.delete('/:roomId', roomController.deleteRoom);

module.exports = router;
