const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*......................Signup API............................ */
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ message: 'User already exists' });
  }

  // Create a new user instance
  const user = new User({ username, email, password });

  try {
    // Save the user to the database
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send({ message: 'Error creating user' });
  }
};

/*......................Get User Info API............................ */
exports.getUserInfo = async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user information back to the client
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error fetching user information:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/*......................Login API............................ */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });

    // Send the token back to the client
    res.status(200).json({ message: 'Success', user /*,token*/ });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
