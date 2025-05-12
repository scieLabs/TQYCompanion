import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

// export const authenticateUser = async (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided, authorization denied.' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     if (!req.user) {
//       return res.status(401).json({ message: 'User not found, authorization denied.' });
//     }

//     next();
//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(401).json({ message: 'Token is not valid.' });
//   }
// };

import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

      // Attach the user to the request object
      req.user = await User.findById(decoded.id).select('-password'); // Exclude the password
      next();
    } catch (error) {
      console.error('Not authorized, token failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token.' });
  }
};