const mongoose = require('mongoose');

const accuracySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  easy: {
    averageAccuracy: {
      type: Number,
      default: 0
    },
    entries: {
      type: Number,
      default: 0
    }
  },
  medium: {
    averageAccuracy: {
      type: Number,
      default: 0
    },
    entries: {
      type: Number,
      default: 0
    }
  },
  hard: {
    averageAccuracy: {
      type: Number,
      default: 0
    },
    entries: {
      type: Number,
      default: 0
    }
  },
  'Quantitative Aptitude': {
    averageAccuracy: {
      type: Number,
      default: 0
    },
    entries: {
      type: Number,
      default: 0
    }
  },
  'Verbal Ability': {
    averageAccuracy: {
      type: Number,
      default: 0
    },
    entries: {
      type: Number,
      default: 0
    }
  },
  'Logical Reasoning': {
    averageAccuracy: {
      type: Number,
      default: 0
    },
    entries: {
      type: Number,
      default: 0
    }
  }
});

const Accuracy = mongoose.model('Accuracy', accuracySchema);

module.exports = Accuracy;
