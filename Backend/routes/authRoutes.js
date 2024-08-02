const express = require('express');
const router = express.Router();

const { signup, login, getUserInfo } = require('../Controller/authController');

router.post('/signup', signup);
router.get('/user/:email', getUserInfo);
router.post('/login', login);

module.exports = router;
