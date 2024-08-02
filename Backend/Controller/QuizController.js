const quizzes = require('../models/Quiz');

const startQuiz = (roomId) => {
  const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
  pusher.trigger(roomId, 'start-quiz', randomQuiz);
};

const submitQuiz = (roomId, playerScores) => {
  pusher.trigger(roomId, 'end-quiz', playerScores);
};

module.exports = { startQuiz, submitQuiz };
