const mongoose = require('mongoose');

const MCQSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

const GameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  gameName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  noOfQuestions: {
    type: Number,
    required: true
  },
  mcqs: {
    type: [MCQSchema],
    validate: {
      validator: function(v) {
        return v.length === this.noOfQuestions;
      },
      message: 'The number of MCQs must match the number of questions'
    },
    required: true
  }
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
