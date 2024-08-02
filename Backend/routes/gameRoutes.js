const express = require('express');
const router = express.Router();

const authenticate = require('../Middleware/authMiddleware');
const authorizeAdmin = require('../Middleware/adminMiddleware');
const { createGame, getGames, updateGame, deleteGame, getRandomGame } = require('../Controller/gameController');

router.post('/', createGame);
router.get('/', getGames);
router.get('/:id', getGames);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);
router.get('/room', getRandomGame);

module.exports = router;
