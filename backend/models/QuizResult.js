const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  chapterIndex: { type: Number, default: -1 }, // -1 represents final exam, 0+ represents chapter quiz
  chapterTitle: { type: String, default: '' },
  marks: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  skippedQuestions: { type: Number, default: 0 },
  timeTaken: { type: Number, required: true }, // in seconds
  performanceLevel: { type: String, default: 'Good' },
  passStatus: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
