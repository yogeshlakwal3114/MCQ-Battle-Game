const AccuracyRoom = require('../models/AccuracyRoom');

// Create a new accuracy record
exports.createAccuracy = async (req, res) => {
  const { email, wins, loss, easy, medium, hard, QuantitativeAptitude, VerbalAbility, LogicalReasoning } = req.body;
  try {
    const newAccuracy = new AccuracyRoom({ email, wins, loss, easy, medium, hard, 'Quantitative Aptitude': QuantitativeAptitude, 'Verbal Ability': VerbalAbility, 'Logical Reasoning': LogicalReasoning });
    const savedAccuracy = await newAccuracy.save();
    res.status(201).json(savedAccuracy);
  } catch (error) {
    res.status(500).json({ message: 'Error creating accuracy record', error });
  }
};

// Read an accuracy record by email
exports.getAccuracyByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    let accuracy = await AccuracyRoom.findOne({ email });
    if (!accuracy){
      const defaultAccuracy = {
        email: email,
        wins: 0,
        loss: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        'Quantitative Aptitude': 0,
        'Verbal Ability': 0,
        'Logical Reasoning': 0
      };

      // Create the new accuracy record
      accuracy = new AccuracyRoom(defaultAccuracy);
      await accuracy.save();

      return res.status(201).json(accuracy);
    }
    res.status(200).json(accuracy);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accuracy record', error });
  }
};

exports.getAccuracy = async (req, res) => {
  try {
    const Accuracy = await AccuracyRoom.find();
    res.status(200).json(Accuracy);
  } catch (err) {
    console.error('Error fetching Accuracy:', err);
    res.status(500).send({ message: 'Error fetching Accuracys' });
  }
};

// Update an accuracy record
exports.updateAccuracy = async (req, res) => {
  const { email } = req.params;
  const { wins, loss, easy, medium, hard, QuantitativeAptitude, VerbalAbility, LogicalReasoning } = req.body;
  try {
    const updatedAccuracy = await AccuracyRoom.findOneAndUpdate(
      { email },
      { wins, loss, easy, medium, hard, 'Quantitative Aptitude': QuantitativeAptitude, 'Verbal Ability': VerbalAbility, 'Logical Reasoning': LogicalReasoning },
      { new: true }
    );
    if (!updatedAccuracy) return res.status(404).json({ message: 'Accuracy record not found' });
    res.status(200).json(updatedAccuracy);
  } catch (error) {
    res.status(500).json({ message: 'Error updating accuracy record', error });
  }
};

// Delete an accuracy record
exports.deleteAccuracy = async (req, res) => {
  const { email } = req.params;
  try {
    const deletedAccuracy = await AccuracyRoom.findOneAndDelete({ email });
    if (!deletedAccuracy) return res.status(404).json({ message: 'Accuracy record not found' });
    res.status(200).json({ message: 'Accuracy record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting accuracy record', error });
  }
};

// Increment win/loss, subject, difficulty

exports.incrementCounts = async (req, res) => {
  const { email } = req.params;
  const { type, subject, difficulty } = req.body;

  try {
    let update = {};

    // Increment based on type (win or loss)
    if (type === 'win') {
      update.wins = 1;
    } else if (type === 'loss') {
      update.loss = 1;
    }

    // Increment based on subject
    if (subject) {
      update[subject] = 1;
    }

    // Increment based on difficulty
    if (difficulty) {
      update[difficulty] = 1;
    }

    const accuracy = await AccuracyRoom.findOneAndUpdate(
      { email },
      { $inc: update },
      { new: true }
    );

    if (!accuracy) {
      return res.status(404).json({ message: 'Accuracy record not found' });
    }

    res.status(200).json(accuracy);
  } catch (error) {
    res.status(500).json({ message: 'Error updating counts', error });
  }
};