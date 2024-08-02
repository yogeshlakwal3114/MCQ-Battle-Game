const express = require('express');
const router = express.Router();
const {createRoom, getRoom, updateResults, deleteRoom, getRoomById } = require('../Controller/roomFriendGameController');

router.post('/', createRoom);
router.get('/:roomId', getRoom);
router.put('/:roomId', updateResults);
router.delete('/:roomId', deleteRoom);

module.exports = router;
