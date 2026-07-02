const coursesData = require('./coursesData');

// Mock in-memory database arrays
const users = [
  {
    _id: 'mock-admin-id-112233',
    name: 'Administrator',
    email: 'admin@quizapp.com',
    password: 'adminpassword123',
    role: 'admin',
    xpPoints: 1500,
    coins: 120,
    level: 4,
    completedChapters: [],
    completedTopics: [],
    completedCourses: [],
    learningTimeToday: 15,
    totalLearningTime: 120,
    badges: ['Platform Architect', 'Welcome Cadet'],
    streakCount: 1,
    lastActiveDate: new Date(),
    isDisabled: false,
    createdAt: new Date()
  },
  {
    _id: 'mock-user-id-445566',
    name: 'Test Student',
    email: 'student@quizapp.com',
    password: 'studentpassword123',
    role: 'user',
    xpPoints: 150,
    coins: 10,
    level: 1,
    completedChapters: [],
    completedTopics: [],
    completedCourses: [],
    learningTimeToday: 5,
    totalLearningTime: 35,
    badges: ['Welcome Cadet'],
    streakCount: 2,
    lastActiveDate: new Date(),
    isDisabled: false,
    createdAt: new Date()
  }
];

// Deep copy courses array for state modification
const courses = JSON.parse(JSON.stringify(coursesData));

const quizResults = [];
const topicFeedback = [];
const contacts = [];

const announcements = [
  { id: 1, title: 'EduQuiz Platform Launch!', content: 'Welcome to the Online Learning and Quiz platform.', date: new Date() },
  { id: 2, title: 'MERN Stack Course Added', content: 'You can now learn React, Node, Express, and MongoDB altogether.', date: new Date() }
];

const feedback = [
  {
    _id: 'mock-feed-1',
    userId: 'mock-user-id-445566',
    studentName: 'Test Student',
    type: 'Feedback',
    rating: 5,
    comment: 'Excellent learning materials! The copy code buttons are extremely handy.',
    adminReply: 'Thank you for your feedback! Glad you like the platform.',
    createdAt: new Date()
  },
  {
    _id: 'mock-feed-2',
    userId: 'mock-user-id-445566',
    studentName: 'Test Student',
    type: 'Bug Report',
    rating: 3,
    comment: 'The timer text transitions are slightly overlapping on my smartphone browser in vertical layout.',
    adminReply: '',
    createdAt: new Date()
  }
];

module.exports = {
  users,
  courses,
  quizResults,
  topicFeedback,
  contacts,
  announcements,
  feedback
};
