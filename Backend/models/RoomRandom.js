const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: { type: [String], default: [] },
  emails: { type: [String], default: [] }
});

module.exports = mongoose.model('Room', roomSchema);
