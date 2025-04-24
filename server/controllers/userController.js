import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CustomError } from '../utils/customError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Get all users
export const getUsers = asyncHandler(async (req, res, next) => {
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
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json(newUser);
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
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: 'Login successful',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

// User Logout
export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};

// Check Session
export const checkSession = (req, res) => {
  if (req.user) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
};