const mongoose = require('mongoose');

const topicFeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  courseId: { type: String, required: true },
  chapterIndex: { type: Number, required: true },
  topicIndex: { type: Number, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  difficulty: { 
    type: String, 
    enum: ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'], 
    required: true 
  },
  understood: { 
    type: String, 
    enum: ['Yes', 'Partially', 'No'], 
    required: true 
  },
  comment: { type: String, default: '' },
  adminReply: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TopicFeedback', topicFeedbackSchema);
