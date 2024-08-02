const mongoose = require('mongoose');

const accuracyRoomSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  wins: {
    type: Number,
    default: 0
  },
  loss: {
    type: Number,
    default: 0
  },
  easy: {
    type: Number,
    default: 0
  },
  medium: {
    type: Number,
    default: 0
  },
  hard: {
    type: Number,
    default: 0
  },
  'Quantitative Aptitude': {
    type: Number,
    default: 0
  },
  'Verbal Ability': {
    type: Number,
    default: 0
  },
  'Logical Reasoning': {
    type: Number,
    default: 0
  }
});

const AccuracyRoom = mongoose.model('AccuracyRoom', accuracyRoomSchema);

module.exports = AccuracyRoom;
