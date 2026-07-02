const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Feedback', 'Suggestion', 'Bug Report', 'Comment'], 
    default: 'Feedback' 
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  adminReply: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
