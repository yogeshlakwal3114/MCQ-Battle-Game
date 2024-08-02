const Review = require('../models/Review');
const User = require('../models/User');

exports.createOrUpdateReview = async (req, res) => {
  try {
    const { email, stars, message } = req.body;

    // Validate the review input
    if (!stars || !message || !email) {
      return res.status(400).json({ message: 'Stars, message, and email are required.' });
    }

    // Fetch user details
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has a review
    let review = await Review.findOne({ email });

    if (review) {
      // Update the existing review
      review.stars = stars;
      review.message = message;
      review.date = new Date();
    } else {
      // Create a new review
      review = new Review({
        username: user.username,
        email: user.email,
        stars,
        message,
        date: new Date()
      });
    }

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
