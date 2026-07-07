const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const mockDb = require('../data/mockDb');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey123!@#', {
    expiresIn: '30d',
  });
};

// Helper to check and update learning streak
const updateStreak = async (user, isMock = false) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.lastActiveDate) {
    user.streakCount = 1;
    user.lastActiveDate = today;
    if (!isMock) await user.save();
    return;
  }

  const lastActive = new Date(user.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    user.streakCount += 1;
    user.lastActiveDate = today;
    if (user.streakCount === 7 && !user.badges.includes('7-Day Streak')) {
      user.badges.push('7-Day Streak');
      user.xpPoints += 500;
    }
    if (!isMock) await user.save();
  } else if (diffDays > 1) {
    user.streakCount = 1;
    user.lastActiveDate = today;
    if (!isMock) await user.save();
  }
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const registerUser = async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';

  try {
    if (!getIsConnected()) {
      // In-Memory Mock Mode
      const userExists = mockDb.users.find(u => u.email.toLowerCase() === email);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = {
        _id: 'mock-user-id-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password, // Raw check for simplicity in mock
        role: 'user',
        xpPoints: 100,
        badges: ['Welcome Cadet'],
        streakCount: 1,
        lastActiveDate: new Date(),
        createdAt: new Date()
      };

      mockDb.users.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        xpPoints: newUser.xpPoints,
        badges: newUser.badges,
        streakCount: newUser.streakCount,
        token: generateToken(newUser._id),
      });
    }

    // Standard MongoDB Mode
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      xpPoints: 100,
      badges: ['Welcome Cadet'],
      lastActiveDate: new Date(),
      streakCount: 1
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xpPoints: user.xpPoints,
        badges: user.badges,
        streakCount: user.streakCount,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  const { password } = req.body;
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';

  try {
    if (!getIsConnected()) {
      // In-Memory Mock Mode
      const user = mockDb.users.find(u => u.email.toLowerCase() === email);
      if (user && (user.password === password || await bcrypt.compare(password, user.password).catch(() => false))) {
        if (user.isDisabled) {
          return res.status(403).json({ message: 'Your account has been disabled by the Administrator. Please contact support.' });
        }
        updateStreak(user, true);

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          xpPoints: user.xpPoints,
          badges: user.badges,
          streakCount: user.streakCount,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Standard MongoDB Mode
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (user.isDisabled) {
        return res.status(403).json({ message: 'Your account has been disabled by the Administrator. Please contact support.' });
      }
      await updateStreak(user);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xpPoints: user.xpPoints,
        badges: user.badges,
        streakCount: user.streakCount,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const user = mockDb.users.find(u => u._id === req.user._id);
      if (user) {
        updateStreak(user, true);
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          xpPoints: user.xpPoints,
          coins: user.coins || 0,
          level: user.level || 1,
          badges: user.badges || [],
          streakCount: user.streakCount || 0,
          completedChapters: user.completedChapters || [],
          completedTopics: user.completedTopics || [],
          completedCourses: user.completedCourses || [],
          learningTimeToday: user.learningTimeToday || 0,
          totalLearningTime: user.totalLearningTime || 0
        });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const user = await User.findById(req.user._id);
    if (user) {
      await updateStreak(user);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xpPoints: user.xpPoints,
        coins: user.coins || 0,
        level: user.level || 1,
        badges: user.badges || [],
        streakCount: user.streakCount || 0,
        completedChapters: user.completedChapters || [],
        completedTopics: user.completedTopics || [],
        completedCourses: user.completedCourses || [],
        learningTimeToday: user.learningTimeToday || 0,
        totalLearningTime: user.totalLearningTime || 0
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update user profile or bookmarks
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const user = mockDb.users.find(u => u._id === req.user._id);
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.xpPoints !== undefined) user.xpPoints = req.body.xpPoints;
        if (req.body.badges && Array.isArray(req.body.badges)) {
          user.badges = [...new Set([...user.badges, ...req.body.badges])];
        }

        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          xpPoints: user.xpPoints,
          coins: user.coins || 0,
          level: user.level || 1,
          badges: user.badges || [],
          streakCount: user.streakCount || 0,
          completedChapters: user.completedChapters || [],
          completedTopics: user.completedTopics || [],
          completedCourses: user.completedCourses || [],
          learningTimeToday: user.learningTimeToday || 0,
          totalLearningTime: user.totalLearningTime || 0,
          token: generateToken(user._id),
        });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.body.badges && Array.isArray(req.body.badges)) {
        user.badges = [...new Set([...user.badges, ...req.body.badges])];
      }

      if (req.body.xpPoints !== undefined) {
        user.xpPoints = req.body.xpPoints;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        xpPoints: updatedUser.xpPoints,
        coins: updatedUser.coins || 0,
        level: updatedUser.level || 1,
        badges: updatedUser.badges || [],
        streakCount: updatedUser.streakCount || 0,
        completedChapters: updatedUser.completedChapters || [],
        completedTopics: updatedUser.completedTopics || [],
        completedCourses: updatedUser.completedCourses || [],
        learningTimeToday: updatedUser.learningTimeToday || 0,
        totalLearningTime: updatedUser.totalLearningTime || 0,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Sync user learning time
 * @route   POST /api/auth/learning-time
 * @access  Private
 */
const syncLearningTime = async (req, res) => {
  const { minutes } = req.body;
  const mins = parseInt(minutes);
  if (isNaN(mins) || mins <= 0) {
    return res.status(400).json({ message: 'Invalid minutes value' });
  }

  try {
    let user;
    if (!getIsConnected()) {
      user = mockDb.users.find(u => u._id === req.user._id);
    } else {
      user = await User.findById(req.user._id);
    }

    if (user) {
      user.learningTimeToday = (user.learningTimeToday || 0) + mins;
      user.totalLearningTime = (user.totalLearningTime || 0) + mins;

      if (getIsConnected()) {
        await user.save();
      }

      res.json({
        success: true,
        learningTimeToday: user.learningTimeToday,
        totalLearningTime: user.totalLearningTime
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  syncLearningTime,
};
