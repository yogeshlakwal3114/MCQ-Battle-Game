// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const { startQuiz, submitQuiz } = require('../Controller/QuizController');

router.post('/start', (req, res) => {
  const { roomId } = req.body;
  startQuiz(roomId);
  res.status(200).send('Quiz started');
});

router.post('/submit', (req, res) => {
  const { roomId, playerScores } = req.body;
  submitQuiz(roomId, playerScores);
  res.status(200).send('Scores submitted');
});

module.exports = router;
