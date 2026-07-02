const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  definition: { type: String },
  explanation: { type: String },
  syntax: { type: String },
  codeExample: { type: String },
  output: { type: String },
  realWorldExample: { type: String },
  interviewQuestions: [{
    question: { type: String },
    answer: { type: String }
  }],
  importantPoints: [{ type: String }],
  tips: [{ type: String }],
  summary: { type: String }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index of correct option (0-3)
  explanation: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }
});

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseId: { type: String, required: true, unique: true }, // e.g. "html", "react"
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  estimatedTime: { type: String }, // e.g. "4 hours"
  image: { type: String }, // image name or CSS class
  chapters: [chapterSchema],
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
