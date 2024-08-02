const User = require('../models/User');
const bcrypt = require('bcrypt');

const authenticate = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication failed:', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticate;


// const jwt = require('jsonwebtoken');
// const jwtSecret = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjczZTJhYzdhZTcxZGFkNmJjOGMwMjkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTg4NzUyNzksImV4cCI6MTcxODg3ODg3OX0.iNorLN8PXrvQNQYW-uSUSOllcg-7V2-8yWt9V8Hb0cw';

// const authenticate = (req, res, next) => {
//   // Check if Authorization header exists
//   const authHeader = req.header('Authorization');
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   // Extract token from Authorization header
//   const token = authHeader.replace('Bearer ', '');

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, jwtSecret);
//     req.user = decoded; // Attach user object to request
//     next();
//   } catch (err) {
//     console.error('Token verification failed:', err);
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// module.exports = authenticate;