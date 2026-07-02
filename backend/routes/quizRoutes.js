const express = require('express');
const router = express.Router();
const { submitQuiz, getQuizHistory } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);

module.exports = router;
