const Accuracy = require('../models/Accuracy');

// Update
const updateAccuracy = async (req, res) => {
  const { email, category, accuracy } = req.body;

  try {
    let userAccuracy = await Accuracy.findOne({ email });

    if (!userAccuracy) {
      userAccuracy = new Accuracy({ email });
    }

    // Check if the category exists, if not create it
    if (!userAccuracy[category]) {
      userAccuracy[category] = {
        entries: 0,
        averageAccuracy: 0
      };
    }

    let categoryData = userAccuracy[category];

    // Update number of entries
    const newTotalAccuracy = Math.floor((categoryData.averageAccuracy * categoryData.entries + accuracy) / (categoryData.entries + 1));
    categoryData.entries++;
    categoryData.averageAccuracy = newTotalAccuracy;

    // Save the updated/created accuracy document
    await userAccuracy.save();

    res.status(200).json({ message: 'Accuracy updated successfully.' });
  } catch (err) {
    console.error('Error updating accuracy:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};


// get by Email Id
const getAccuracyByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const userAccuracy = await Accuracy.findOne({ email });

    if (!userAccuracy) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(userAccuracy);
  } catch (err) {
    console.error('Error fetching accuracy:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getAccuracyByEmail, updateAccuracy };
