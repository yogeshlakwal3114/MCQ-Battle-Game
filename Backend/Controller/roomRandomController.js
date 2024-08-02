const Room = require('../models/RoomRandom');
const User = require('../models/User');
// const io = require('../server');
const cron = require('node-cron');

exports.createRoom = async (req, res) => {
  try {
    const { roomId, username, email } = req.body;

    // Validate the input
    if (!roomId || !username || !email) {
      return res.status(400).json({ message: 'Room ID and username are required.' });
    }

    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room ID already exists. Please choose a different one.' });
    }

    const newRoom = new Room({ roomId, players: [username] , emails:[email]});
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getRoomById = async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.joinRoom = async (req, res) => {
  try {
    const { roomId, playerName, playerEmail } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.players.length >= 2) {
      return res.status(400).json({ message: 'Room is full' });
    }
    room.players.push(playerName);
    room.emails.push(playerEmail);
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    await Room.deleteOne({ roomId });
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


cron.schedule('0 0 * * *', async () => {
  try {
    await Room.deleteMany({});
    console.log('All rooms deleted successfully');
  } catch (error) {
    console.error('Error deleting rooms:', error);
  }
});