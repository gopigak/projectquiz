const express = require('express');
const router = express.Router();
const {
  getOverallLeaderboard,
  getCourseLeaderboard,
} = require('../controllers/leaderboardController');

router.route('/').get(getOverallLeaderboard);
router.route('/:courseId').get(getCourseLeaderboard);

module.exports = router;
