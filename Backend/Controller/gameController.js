const Game = require('../models/Game');

// Create a new game
exports.createGame = async (req, res) => {
  const { gameId, gameName, subject, difficulty, noOfQuestions, mcqs } = req.body;

  // Validate the number of MCQs
  if (mcqs.length !== noOfQuestions) {
    return res.status(400).send({ message: 'The number of MCQs must match the number of questions' });
  }

  const game = new Game({ gameId, gameName, subject, difficulty, noOfQuestions, mcqs });

  try {
    await game.save();
    res.status(201).send({ message: 'Game created successfully', game });
  } catch (err) {
    console.error('Error creating game:', err);
    res.status(500).send({ message: 'Error creating game' });
  }
};

// Get all games
exports.getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).send({ message: 'Error fetching games' });
  }
};

// Get game by ID
exports.getGameById = async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).send({ message: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (err) {
    console.error('Error fetching game:', err);
    res.status(500).send({ message: 'Error fetching game' });
  }
};

// Update a game by ID
exports.updateGame = async (req, res) => {
  const { id } = req.params;
  const { gameName, subject, difficulty, noOfQuestions, mcqs } = req.body;

  // Validate the number of MCQs
  if (mcqs.length !== noOfQuestions) {
    return res.status(400).send({ message: 'The number of MCQs must match the number of questions' });
  }

  try {
    const game = await Game.findByIdAndUpdate(id, { gameName, subject, difficulty, noOfQuestions, mcqs }, { new: true });
    if (!game) {
      return res.status(404).send({ message: 'Game not found' });
    }
    res.status(200).send({ message: 'Game updated successfully', game });
  } catch (err) {
    console.error('Error updating game:', err);
    res.status(500).send({ message: 'Error updating game' });
  }
};

// Delete a game by ID
exports.deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).send({ message: 'Game not found' });
    }
    res.status(200).send({ message: 'Game deleted successfully' });
  } catch (err) {
    console.error('Error deleting game:', err);
    res.status(500).send({ message: 'Error deleting game' });
  }
};


// random game
exports.getRandomGame = async () => {
  try {
    const game = await Game.aggregate([{ $sample: { size: 1 } }]);
    return game[0];
  } catch (error) {
    console.error('Error fetching random game:', error);
    throw error;
  }
};