const Course = require('../models/Course');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Feedback = require('../models/Feedback');
const TopicFeedback = require('../models/TopicFeedback');
const Contact = require('../models/Contact');
const { getIsConnected } = require('../config/db');
const mockDb = require('../data/mockDb');

/**
 * @desc    Get comprehensive dashboard analytics statistics for Admin
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!getIsConnected()) {
      // In-Memory Mock Mode calculations
      const totalUsers = mockDb.users.length;
      const totalStudents = mockDb.users.filter(u => u.role === 'user').length;
      const totalCourses = mockDb.courses.length;
      const totalResults = mockDb.quizResults.length;
      
      const totalTopics = mockDb.courses.reduce((acc, c) => acc + c.chapters.length, 0);
      const totalQuestions = mockDb.courses.reduce((acc, c) => {
        const chapQs = c.chapters.reduce((sum, chap) => sum + (chap.questions?.length || 0), 0);
        const flatQs = c.questions?.length || 0;
        return acc + chapQs + flatQs;
      }, 0);

      const sumPercentage = mockDb.quizResults.reduce((acc, curr) => acc + curr.percentage, 0);
      const avgPercentage = totalResults > 0 ? Math.round(sumPercentage / totalResults) : 0;

      const todayUsers = mockDb.users.filter(u => {
        if (!u.lastActiveDate) return false;
        const d = new Date(u.lastActiveDate);
        d.setHours(0,0,0,0);
        return d.getTime() === today.getTime();
      }).length;

      const activeUsers = mockDb.users.filter(u => !u.isDisabled).length;

      const recentResults = mockDb.quizResults.slice(0, 10);
      const recentUsers = mockDb.users.map(({ password, ...u }) => u).slice(0, 10);
      const latestFeedback = mockDb.feedback.slice(0, 5);

      // Course-wise Progress Analytics
      const courseStats = mockDb.courses.map(c => {
        const attempts = mockDb.quizResults.filter(r => r.courseId === c.courseId);
        const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((sum, curr) => sum + curr.percentage, 0) / attempts.length) : 0;
        return {
          courseName: c.name,
          attemptsCount: attempts.length,
          avgScore
        };
      });

      return res.json({
        stats: {
          totalUsers,
          totalStudents,
          totalCourses,
          totalTopics,
          totalQuestions,
          completedTests: totalResults,
          avgPercentage,
          todayUsers,
          activeUsers
        },
        recentResults,
        recentUsers,
        latestFeedback,
        courseStats,
        announcements: mockDb.announcements
      });
    }

    // Standard MongoDB Database Mode calculations
    const totalUsers = await User.countDocuments({});
    const totalStudents = await User.countDocuments({ role: 'user' });
    const totalCourses = await Course.countDocuments({});
    const completedTests = await QuizResult.countDocuments({});

    // Count topics and questions
    const coursesDataList = await Course.find({}).select('chapters questions');
    const totalTopics = coursesDataList.reduce((acc, c) => acc + c.chapters.length, 0);
    const totalQuestions = coursesDataList.reduce((acc, c) => {
      const chapQs = c.chapters.reduce((sum, chap) => sum + (chap.questions?.length || 0), 0);
      const flatQs = c.questions?.length || 0;
      return acc + chapQs + flatQs;
    }, 0);

    const avgAgg = await QuizResult.aggregate([
      { $group: { _id: null, avgPercentage: { $avg: '$percentage' } } }
    ]);
    const avgPercentage = avgAgg.length > 0 ? Math.round(avgAgg[0].avgPercentage) : 0;

    const todayUsers = await User.countDocuments({
      lastActiveDate: { $gte: today }
    });

    const activeUsers = await User.countDocuments({ isDisabled: false });

    const recentResults = await QuizResult.find({}).sort({ createdAt: -1 }).limit(10);
    const recentUsers = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(10);
    const latestFeedback = await Feedback.find({}).sort({ createdAt: -1 }).limit(5);

    // Course attempts analytics
    const courseStats = await Promise.all(
      (await Course.find({}).select('name courseId')).map(async (c) => {
        const attemptsCount = await QuizResult.countDocuments({ courseId: c.courseId });
        const avgAggC = await QuizResult.aggregate([
          { $match: { courseId: c.courseId } },
          { $group: { _id: null, avgScore: { $avg: '$percentage' } } }
        ]);
        const avgScore = avgAggC.length > 0 ? Math.round(avgAggC[0].avgScore) : 0;
        return {
          courseName: c.name,
          attemptsCount,
          avgScore
        };
      })
    );

    res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalCourses,
        totalTopics,
        totalQuestions,
        completedTests,
        avgPercentage,
        todayUsers,
        activeUsers
      },
      recentResults,
      recentUsers,
      latestFeedback,
      courseStats,
      announcements: mockDb.announcements
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Toggle student account enabled/disabled status
 * @route   PUT /api/admin/users/:id/toggle
 * @access  Private/Admin
 */
const toggleUserStatus = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const user = mockDb.users.find(u => u._id === req.params.id);
      if (user) {
        if (user.role === 'admin') {
          return res.status(400).json({ message: 'Cannot disable administrative accounts.' });
        }
        user.isDisabled = !user.isDisabled;
        return res.json({ message: `Account status updated. Disabled: ${user.isDisabled}`, user });
      }
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot disable administrative accounts.' });
      }
      user.isDisabled = !user.isDisabled;
      await user.save();
      res.json({ message: `Account status updated. Disabled: ${user.isDisabled}`, user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeedbackList = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const combined = [
        ...mockDb.feedback.map(f => ({
          _id: f._id,
          userId: f.userId,
          studentName: f.studentName,
          type: f.type || 'Platform Feedback',
          rating: f.rating,
          comment: f.comment,
          adminReply: f.adminReply || '',
          createdAt: f.createdAt
        })),
        ...(mockDb.topicFeedback || []).map(f => ({
          _id: f._id,
          userId: f.userId,
          studentName: f.studentName,
          type: 'Topic Feedback',
          rating: f.rating,
          comment: `[Topic Ref: Course ${f.courseId.toUpperCase()}, Chap ${f.chapterIndex + 1}, Topic ${f.topicIndex + 1}] Difficulty: ${f.difficulty}, Understood: ${f.understood}. comment: ${f.comment}`,
          adminReply: f.adminReply || '',
          createdAt: f.createdAt
        })),
        ...(mockDb.contacts || []).map(c => ({
          _id: c._id,
          userId: c.email,
          studentName: `${c.name} (${c.email}, Phone: ${c.phone})`,
          type: 'Contact Support',
          rating: 5,
          comment: `[Subject: ${c.subject}] ${c.message}`,
          adminReply: c.adminReply || '',
          createdAt: c.createdAt
        }))
      ];
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(combined);
    }

    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    const topicFeedbacks = await TopicFeedback.find({}).sort({ createdAt: -1 });
    const contactMessages = await Contact.find({}).sort({ createdAt: -1 });

    const combined = [
      ...feedbacks.map(f => ({
        _id: f._id,
        userId: f.userId,
        studentName: f.studentName,
        type: f.type || 'Platform Feedback',
        rating: f.rating,
        comment: f.comment,
        adminReply: f.adminReply || '',
        createdAt: f.createdAt
      })),
      ...topicFeedbacks.map(f => ({
        _id: f._id,
        userId: f.userId,
        studentName: f.studentName,
        type: 'Topic Feedback',
        rating: f.rating,
        comment: `[Topic Ref: Course ${f.courseId.toUpperCase()}, Chap ${f.chapterIndex + 1}, Topic ${f.topicIndex + 1}] Difficulty: ${f.difficulty}, Understood: ${f.understood}. Comment: ${f.comment}`,
        adminReply: f.adminReply || '',
        createdAt: f.createdAt
      })),
      ...contactMessages.map(c => ({
        _id: c._id,
        userId: c.email,
        studentName: `${c.name} (${c.email}, Phone: ${c.phone})`,
        type: 'Contact Support',
        rating: 5,
        comment: `[Subject: ${c.subject}] ${c.message}`,
        adminReply: c.adminReply || '',
        createdAt: c.createdAt
      }))
    ];

    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const replyToFeedback = async (req, res) => {
  const { reply } = req.body;
  try {
    if (!getIsConnected()) {
      const feed = mockDb.feedback.find(f => f._id === req.params.id);
      if (feed) {
        feed.adminReply = reply;
        return res.json(feed);
      }
      const tf = mockDb.topicFeedback.find(f => f._id === req.params.id);
      if (tf) {
        tf.adminReply = reply;
        return res.json(tf);
      }
      const c = mockDb.contacts.find(f => f._id === req.params.id);
      if (c) {
        c.adminReply = reply;
        return res.json(c);
      }
      return res.status(404).json({ message: 'Feedback not found' });
    }

    let feed = await Feedback.findById(req.params.id);
    if (feed) {
      feed.adminReply = reply;
      await feed.save();
      return res.json(feed);
    }
    
    let tf = await TopicFeedback.findById(req.params.id);
    if (tf) {
      tf.adminReply = reply;
      await tf.save();
      return res.json(tf);
    }

    let c = await Contact.findById(req.params.id);
    if (c) {
      c.adminReply = reply;
      await c.save();
      return res.json(c);
    }

    res.status(404).json({ message: 'Feedback record not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new course
 * @route   POST /api/admin/courses
 * @access  Private/Admin
 */
const createCourse = async (req, res) => {
  const { name, courseId, description, difficulty, estimatedTime, image } = req.body;

  try {
    if (!getIsConnected()) {
      const courseExists = mockDb.courses.find((c) => c.courseId === courseId);
      if (courseExists) {
        return res.status(400).json({ message: 'Course ID already exists' });
      }

      const newCourse = {
        _id: 'mock-course-' + Math.random().toString(36).substr(2, 9),
        name,
        courseId,
        description,
        difficulty,
        estimatedTime,
        image: image || 'default-icon',
        chapters: [],
        questions: []
      };

      mockDb.courses.push(newCourse);
      return res.status(201).json(newCourse);
    }

    const courseExists = await Course.findOne({ courseId });
    if (courseExists) {
      return res.status(400).json({ message: 'Course ID already exists' });
    }

    const course = await Course.create({
      name,
      courseId,
      description,
      difficulty,
      estimatedTime,
      image,
      chapters: [],
      questions: []
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update a course
 * @route   PUT /api/admin/courses/:id
 * @access  Private/Admin
 */
const updateCourse = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const course = mockDb.courses.find((c) => c.courseId === req.params.id);
      if (course) {
        course.name = req.body.name || course.name;
        course.description = req.body.description || course.description;
        course.difficulty = req.body.difficulty || course.difficulty;
        course.estimatedTime = req.body.estimatedTime || course.estimatedTime;
        course.image = req.body.image || course.image;
        return res.json(course);
      } else {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    const course = await Course.findOne({ courseId: req.params.id });

    if (course) {
      course.name = req.body.name || course.name;
      course.description = req.body.description || course.description;
      course.difficulty = req.body.difficulty || course.difficulty;
      course.estimatedTime = req.body.estimatedTime || course.estimatedTime;
      course.image = req.body.image || course.image;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/admin/courses/:id
 * @access  Private/Admin
 */
const deleteCourse = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const idx = mockDb.courses.findIndex((c) => c.courseId === req.params.id);
      if (idx !== -1) {
        mockDb.courses.splice(idx, 1);
        return res.json({ message: 'Course deleted successfully from mock database' });
      } else {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    const result = await Course.findOneAndDelete({ courseId: req.params.id });
    if (result) {
      res.json({ message: 'Course deleted successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add a notes chapter to a course
 * @route   POST /api/admin/courses/:id/chapters
 * @access  Private/Admin
 */
const addChapter = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const course = mockDb.courses.find((c) => c.courseId === req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      course.chapters.push(req.body);
      return res.status(201).json(course);
    }

    const course = await Course.findOne({ courseId: req.params.id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.chapters.push(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add a quiz question to a course
 * @route   POST /api/admin/courses/:id/questions
 * @access  Private/Admin
 */
const addQuestion = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const course = mockDb.courses.find((c) => c.courseId === req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      course.questions.push(req.body);
      return res.status(201).json(course);
    }

    const course = await Course.findOne({ courseId: req.params.id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.questions.push(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all users list
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const userList = mockDb.users.map(({ password, ...u }) => u);
      return res.json(userList);
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const idx = mockDb.users.findIndex((u) => u._id === req.params.id);
      if (idx !== -1) {
        const user = mockDb.users[idx];
        if (user.role === 'admin' && user.email === 'admin@quizapp.com') {
          return res.status(400).json({ message: 'Cannot delete primary Administrator' });
        }
        mockDb.users.splice(idx, 1);
        return res.json({ message: 'User removed successfully from mock database' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin' && user.email === 'admin@quizapp.com') {
        return res.status(400).json({ message: 'Cannot delete primary Administrator' });
      }
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Send announcement
 * @route   POST /api/admin/announcements
 * @access  Private/Admin
 */
const postAnnouncement = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content required' });

  const newAnn = {
    id: mockDb.announcements.length + 1,
    title,
    content,
    date: new Date()
  };

  mockDb.announcements.unshift(newAnn);
  res.status(201).json(newAnn);
};

module.exports = {
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
};
