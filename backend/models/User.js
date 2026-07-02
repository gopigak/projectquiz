const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  xpPoints: { type: Number, default: 100 },
  coins: { type: Number, default: 50 }, // Gamification: coins balance
  level: { type: Number, default: 1 },  // Gamification: user level based on XP
  badges: { type: [String], default: [] },
  streakCount: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: null },
  isDisabled: { type: Boolean, default: false },
  
  // Progress tracking
  completedChapters: { type: [String], default: [] }, // Format: 'courseId_chapterIndex'
  completedTopics: { type: [String], default: [] },   // Format: 'courseId_chapterIndex_topicIndex'
  completedCourses: { type: [String], default: [] },  // List of courseIds completed
  
  // Learning stats
  learningTimeToday: { type: Number, default: 0 },    // In minutes
  totalLearningTime: { type: Number, default: 0 },    // In minutes
  
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
