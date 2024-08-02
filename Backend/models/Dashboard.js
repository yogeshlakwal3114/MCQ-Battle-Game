const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true
  },
  Correct: {
    type: Number,
    default: 0
  }
});

const dashboardSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  TotalQuestions: {
    type: Number,
    default: 0
  },
  TotalCorrect: {
    type: Number,
    default: 0
  },
  TotalWrong: {
    type: Number,
    default: 0
  },
  TotalUnanswered: {
    type: Number,
    default: 0
  },
  TotalTimeAverage: {
    type: Number,
    default: 0
  },
  games: [gameSchema]
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

module.exports = Dashboard;