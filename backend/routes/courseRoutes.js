const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  getCourseNotes,
  getCourseQuiz,
  completeChapter,
  completeTopic,
  submitFeedback,
  submitTopicFeedback
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getCourses);
router.route('/feedback').post(protect, submitFeedback);
router.route('/topic-feedback').post(protect, submitTopicFeedback);
router.route('/complete-chapter').post(protect, completeChapter);
router.route('/complete-topic').post(protect, completeTopic);
router.route('/:id').get(getCourseById);
router.route('/:id/notes').get(protect, getCourseNotes);
router.route('/:id/quiz').get(protect, getCourseQuiz);

module.exports = router;
