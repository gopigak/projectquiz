const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const { getIsConnected } = require('../config/db');
const mockDb = require('../data/mockDb');

/**
 * @desc    Get overall global leaderboard sorted by user XP Points
 * @route   GET /api/leaderboard
 * @access  Public
 */
const getOverallLeaderboard = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const leaders = [...mockDb.users]
        .sort((a, b) => b.xpPoints - a.xpPoints)
        .slice(0, 15)
        .map((u) => ({
          _id: u._id,
          name: u.name,
          xpPoints: u.xpPoints,
          streakCount: u.streakCount,
          badges: u.badges,
        }));
      return res.json(leaders);
    }

    const leaders = await User.find({})
      .select('name xpPoints streakCount badges')
      .sort({ xpPoints: -1 })
      .limit(15);
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get leaderboard for a specific course sorted by marks and time taken
 * @route   GET /api/leaderboard/:courseId
 * @access  Public
 */
const getCourseLeaderboard = async (req, res) => {
  const { courseId } = req.params;

  try {
    if (!getIsConnected()) {
      const leaders = mockDb.quizResults
        .filter((r) => r.courseId === courseId)
        .sort((a, b) => {
          if (b.percentage !== a.percentage) return b.percentage - a.percentage;
          if (b.marks !== a.marks) return b.marks - a.marks;
          return a.timeTaken - b.timeTaken;
        })
        .slice(0, 15);
      return res.json(leaders);
    }

    const leaders = await QuizResult.find({ courseId })
      .select('studentName marks totalQuestions percentage timeTaken createdAt')
      .sort({ percentage: -1, marks: -1, timeTaken: 1 })
      .limit(15);
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOverallLeaderboard,
  getCourseLeaderboard,
};
