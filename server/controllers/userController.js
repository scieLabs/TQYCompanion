import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CustomError } from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

// Get all users
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  res.status(200).json(user);
});

// Create a new user

export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json({ message: 'User registered successfully.', user: newUser });
});


// Update user by ID
export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new CustomError('User not found', 404);
  }

  res.status(200).json(updatedUser);
});


// Delete user by ID
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new CustomError('User not found', 404);
  }

  res.status(204).json({ message: 'User deleted successfully' });
});

//// TO BE UPDATED IN THE UPCOMING AUTH BRANCH
// User Login

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError('Invalid email or password', 401);
  }

  // Create and send token
  const token = jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '14d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development', //TODO: Change to true in production
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: 'Login successful',
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    token, // Include the token in the response for client-side storage
  });
});

// User Logout
export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};

// Check Session

export const checkSession = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    const user = await User.findById(decoded._id); // Find the user by ID

    if (!user) {
      return res.status(404).json({ authenticated: false, message: 'User not found.' });
    }

    // Send the user object with _id
    res.status(200).json({
      authenticated: true,
      user: {
        _id: user._id, // Use _id instead of id
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(401).json({ authenticated: false, message: 'Invalid token.' });
  }
};
// FIXME: old version
// export const checkSession = (req, res) => {
//   const token = req.cookies.token; // Get the token from cookies
//   if (!token) {
//     return res.status(401).json({ authenticated: false, message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
//     res.status(200).json({ authenticated: true, user: decoded }); // Return the decoded user data
//   } catch (err) {
//     res.status(401).json({ authenticated: false, message: 'Invalid token' });
//   }
// };

//FIXME: Old version
// export const checkSession = (req, res) => {
//   if (req.cookies.token) {
//     try {
//       const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
//       res.json({ authenticated: true, user: decoded });
//     } catch (err) {
//       res.json({ authenticated: false });
//     }
//   } else {
//     res.json({ authenticated: false });
//   }
// };