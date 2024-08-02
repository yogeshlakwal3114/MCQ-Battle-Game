const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
  };
  
  module.exports = authorizeAdmin;
  