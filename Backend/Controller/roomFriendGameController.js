const cron = require('node-cron');
const RoomFriendGame = require('../models/RoomFriendGame');
 
// Create a new game room
exports.createRoom = async (req, res) => {
  const { roomId, randomGame, Finished, removed, participants } = req.body;
  try {
    const newRoom = new RoomFriendGame({ roomId, randomGame, Finished, removed, participants });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error });
  }
};

// Get game room details
exports.getRoom = async (req, res) => {
    const { roomId } = req.params;
    // console.log(`Fetching room details for roomId: ${roomId}`); // Log the roomId being fetched
    try {
      const room = await RoomFriendGame.findOne({ roomId });
      if (!room) {
        console.log('Room not found'); // Log if the room is not found
        return res.status(404).json({ message: 'Room not found' });
      }
      // console.log('Room found:', room); // Log the room details if found
      res.status(200).json(room);
    } catch (error) {
      console.error('Error fetching room details:', error); // Log any errors
      res.status(500).json({ message: 'Error fetching room details', error });
    }
  };

  
exports.updateResults = async (req, res) => {
  const { roomId } = req.params;
  const { Finished, removed, playerIndex, correctAnswers, totalTimeTaken } = req.body;

  try {
    const room = await RoomFriendGame.findOne({ roomId });

    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (playerIndex < 0 || playerIndex > 1) {
      return res.status(400).json({ message: 'Invalid player index' });
    }

    // Ensure the participants array has two elements
    if (!room.participants || room.participants.length !== 2) {
      room.participants = [{}, {}];
    }

    room.participants[playerIndex] = {
      correctAnswers: correctAnswers || 0,
      totalTimeTaken: totalTimeTaken || 0,
    };

    room.Finished += Finished;
    room.removed += removed;

    await room.save();

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error updating results', error });
  }
};

// Delete game room
exports.deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await RoomFriendGame.findOneAndDelete({ roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error });
  }
};


// Schedule a task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    await RoomFriendGame.deleteMany({});
    console.log('All rooms deleted successfully');
  } catch (error) {
    console.error('Error deleting rooms:', error);
  }
});