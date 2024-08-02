const mongoose = require('mongoose');

const RoomFriendGameSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  randomGame: { type: Number, required: true, default: -1 },
  Finished: { type: Number, default: 0},
  removed: { type: Number, default: 0},
  participants: {
    type: [
      {
        // email: { type: String, required: true },
        correctAnswers: { type: Number, default: 0 },
        totalTimeTaken: { type: Number, default: 0 }
      }
    ],
    default: [{}, {}]
  }
}, { timestamps: true });

module.exports = mongoose.model('RoomFriendGame', RoomFriendGameSchema);
