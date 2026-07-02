const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  toggleUserStatus,
  getFeedbackList,
  replyToFeedback,
  createCourse,
  updateCourse,
  deleteCourse,
  addChapter,
  addQuestion,
  getUsers,
  deleteUser,
  postAnnouncement
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.route('/courses').post(createCourse);
router.route('/courses/:id')
  .put(updateCourse)
  .delete(deleteCourse);
router.post('/courses/:id/chapters', addChapter);
router.post('/courses/:id/questions', addQuestion);

// Student accounts
router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/users/:id/toggle').put(toggleUserStatus);

// User Feedback dispatches
router.route('/feedback').get(getFeedbackList);
router.route('/feedback/:id/reply').put(replyToFeedback);

// Platform Announcements
router.post('/announcements', postAnnouncement);

module.exports = router;
