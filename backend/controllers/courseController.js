const Course = require('../models/Course');
const Feedback = require('../models/Feedback');
const TopicFeedback = require('../models/TopicFeedback');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const mockDb = require('../data/mockDb');

/**
 * @desc    Get all courses summary
 * @route   GET /api/courses
 * @access  Public
 */
const getCourses = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const formatted = mockDb.courses.map((course) => ({
        _id: course._id || course.courseId,
        name: course.name,
        courseId: course.courseId,
        description: course.description,
        difficulty: course.difficulty,
        estimatedTime: course.estimatedTime,
        image: course.image,
        chaptersCount: course.chapters.length,
        questionsCount: course.questions?.length || 0,
      }));
      return res.json(formatted);
    }

    const courses = await Course.find({});
    const formatted = courses.map((course) => ({
      _id: course._id,
      name: course.name,
      courseId: course.courseId,
      description: course.description,
      difficulty: course.difficulty,
      estimatedTime: course.estimatedTime,
      image: course.image,
      chaptersCount: course.chapters.length,
      questionsCount: course.chapters.reduce((sum, c) => sum + (c.questions?.length || 0), 0)
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get details of a specific course
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourseById = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const course = mockDb.courses.find((c) => c.courseId === req.params.id);
      if (course) {
        return res.json({
          _id: course._id || course.courseId,
          name: course.name,
          courseId: course.courseId,
          description: course.description,
          difficulty: course.difficulty,
          estimatedTime: course.estimatedTime,
          image: course.image,
          prerequisites: ['Basic computer knowledge', 'Desire to learn programming'],
          outcomes: [
            `Master fundamental concepts of ${course.name}`,
            `Write production-grade ${course.name} code`,
            'Build real-world application examples',
            `Crack interview questions related to ${course.name}`
          ],
          topicsCovered: course.chapters.map((c) => c.title),
          chaptersCount: course.chapters.length,
          questionsCount: course.chapters.reduce((sum, c) => sum + (c.questions?.length || 0), 0)
        });
      } else {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    const course = await Course.findOne({ courseId: req.params.id });
    if (course) {
      res.json({
        _id: course._id,
        name: course.name,
        courseId: course.courseId,
        description: course.description,
        difficulty: course.difficulty,
        estimatedTime: course.estimatedTime,
        image: course.image,
        prerequisites: ['Basic computer knowledge', 'Desire to learn programming'],
        outcomes: [
          `Master fundamental concepts of ${course.name}`,
          `Write production-grade ${course.name} code`,
          'Build real-world application examples',
          `Crack interview questions related to ${course.name}`
        ],
        topicsCovered: course.chapters.map((c) => c.title),
        chaptersCount: course.chapters.length,
        questionsCount: course.chapters.reduce((sum, c) => sum + (c.questions?.length || 0), 0)
      });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all notes/chapters for a specific course
 * @route   GET /api/courses/:id/notes
 * @access  Private
 */
const getCourseNotes = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const course = mockDb.courses.find((c) => c.courseId === req.params.id);
      if (course) {
        return res.json({
          name: course.name,
          courseId: course.courseId,
          // Strip out questions from notes for speed
          chapters: course.chapters.map(({ questions, ...chap }) => chap),
        });
      } else {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    const course = await Course.findOne({ courseId: req.params.id }).select('name courseId chapters');
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all quiz questions for a course
 * @route   GET /api/courses/:id/quiz
 * @access  Private
 */
const getCourseQuiz = async (req, res) => {
  const { chapterIndex } = req.query;
  const chapIdx = chapterIndex !== undefined && chapterIndex !== null ? parseInt(chapterIndex) : -1;

  try {
    if (!getIsConnected()) {
      const course = mockDb.courses.find((c) => c.courseId === req.params.id);
      if (course) {
        let dbQuestions = [];
        let chapterTitle = 'Final Certification Exam';

        if (chapIdx >= 0) {
          const chapterObj = course.chapters[chapIdx];
          if (!chapterObj) return res.status(404).json({ message: 'Chapter not found' });
          dbQuestions = chapterObj.questions;
          chapterTitle = `${chapterObj.title} Assessment`;
        } else {
          course.chapters.forEach((chap) => {
            if (dbQuestions.length < 25) {
              dbQuestions.push(...chap.questions.slice(0, 2));
            }
          });
          dbQuestions = dbQuestions.slice(0, 25);
        }

        return res.json({
          name: course.name,
          courseId: course.courseId,
          chapterTitle,
          questions: dbQuestions,
        });
      } else {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    const course = await Course.findOne({ courseId: req.params.id }).select('name courseId chapters');
    if (course) {
      let dbQuestions = [];
      let chapterTitle = 'Final Certification Exam';

      if (chapIdx >= 0) {
        const chapterObj = course.chapters[chapIdx];
        if (!chapterObj) return res.status(404).json({ message: 'Chapter not found' });
        dbQuestions = chapterObj.questions;
        chapterTitle = `${chapterObj.title} Assessment`;
      } else {
        course.chapters.forEach((chap) => {
          if (dbQuestions.length < 25) {
            dbQuestions.push(...chap.questions.slice(0, 2));
          }
        });
        dbQuestions = dbQuestions.slice(0, 25);
      }

      res.json({
        name: course.name,
        courseId: course.courseId,
        chapterTitle,
        questions: dbQuestions,
      });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark a chapter note completed by student
 * @route   POST /api/courses/complete-chapter
 * @access  Private
 */
const completeChapter = async (req, res) => {
  const { courseId, chapterIndex } = req.body;
  const userId = req.user._id;
  const cIdx = parseInt(chapterIndex);

  try {
    let user;
    if (!getIsConnected()) {
      user = mockDb.users.find(u => u._id === userId);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = `${courseId}_${cIdx}`;
    if (!user.completedChapters) user.completedChapters = [];
    if (!user.completedChapters.includes(token)) {
      user.completedChapters.push(token);
    }

    // Award notes progress points: +15 XP and +5 Coins
    user.xpPoints += 15;
    user.coins = (user.coins || 0) + 5;
    user.level = Math.floor(user.xpPoints / 500) + 1;

    if (getIsConnected()) {
      await user.save();
    }

    res.json({
      message: 'Chapter marked as completed! Points awarded.',
      completedChapters: user.completedChapters,
      xpPoints: user.xpPoints,
      coins: user.coins,
      level: user.level
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Submit user feedback/rating/suggestions
 * @route   POST /api/courses/feedback
 * @access  Private
 */
const submitFeedback = async (req, res) => {
  const { type, rating, comment } = req.body;
  const userId = req.user._id;
  const studentName = req.user.name;

  try {
    if (!getIsConnected()) {
      const newFeed = {
        _id: 'mock-feed-id-' + Math.random().toString(36).substr(2, 9),
        userId,
        studentName,
        type: type || 'Feedback',
        rating: parseInt(rating) || 5,
        comment,
        adminReply: '',
        createdAt: new Date()
      };
      mockDb.feedback.unshift(newFeed);
      return res.status(201).json(newFeed);
    }

    const feed = await Feedback.create({
      userId,
      studentName,
      type,
      rating,
      comment
    });
    res.status(201).json(feed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark a topic completed by student and unlock next topic/chapter sequentially
 * @route   POST /api/courses/complete-topic
 * @access  Private
 */
const completeTopic = async (req, res) => {
  const { courseId, chapterIndex, topicIndex } = req.body;
  const userId = req.user._id;
  const cIdx = parseInt(chapterIndex);
  const tIdx = parseInt(topicIndex);

  if (isNaN(cIdx) || isNaN(tIdx)) {
    return res.status(400).json({ message: 'Invalid chapter or topic index.' });
  }

  try {
    let user;
    let course;

    if (!getIsConnected()) {
      user = mockDb.users.find(u => u._id === userId);
      course = mockDb.courses.find(c => c.courseId === courseId);
    } else {
      user = await User.findById(userId);
      course = await Course.findOne({ courseId });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Security Sequential Unlock Check:
    // A topic cIdx_tIdx is unlocked if:
    // - it's the very first topic: cIdx === 0 and tIdx === 0
    // - the previous topic is completed: completedTopics contains cIdx_(tIdx-1)
    // - if tIdx === 0, the last topic of the previous chapter is completed: completedTopics contains (cIdx-1)_3
    const isFirstTopic = cIdx === 0 && tIdx === 0;
    const isPrevTopicDone = tIdx > 0 && user.completedTopics.includes(`${courseId}_${cIdx}_${tIdx - 1}`);
    const isPrevChapterDone = tIdx === 0 && cIdx > 0 && user.completedTopics.includes(`${courseId}_${cIdx - 1}_3`);

    if (!isFirstTopic && !isPrevTopicDone && !isPrevChapterDone) {
      return res.status(403).json({ message: 'Access denied: Previous topics must be completed first.' });
    }

    const topicToken = `${courseId}_${cIdx}_${tIdx}`;
    if (!user.completedTopics) user.completedTopics = [];
    if (!user.completedTopics.includes(topicToken)) {
      user.completedTopics.push(topicToken);
      // Award topic points: +5 XP and +2 Coins
      user.xpPoints += 5;
      user.coins = (user.coins || 0) + 2;
    }

    let chapterFinished = false;
    let courseFinished = false;

    // Check if this completes the chapter (topicIndex 3 is the last of the 4 topics: 0, 1, 2, 3)
    if (tIdx === 3) {
      const chapterToken = `${courseId}_${cIdx}`;
      if (!user.completedChapters) user.completedChapters = [];
      if (!user.completedChapters.includes(chapterToken)) {
        user.completedChapters.push(chapterToken);
        // Award chapter points: +15 XP and +5 Coins
        user.xpPoints += 15;
        user.coins = (user.coins || 0) + 5;
        chapterFinished = true;
      }

      // Check if this completes the course (last chapter has been completed)
      const allChaptersDone = course.chapters.every((_, idx) => 
        user.completedChapters.includes(`${courseId}_${idx}`)
      );

      if (allChaptersDone) {
        if (!user.completedCourses) user.completedCourses = [];
        if (!user.completedCourses.includes(courseId)) {
          user.completedCourses.push(courseId);
          // Award course points: +100 XP and +30 Coins
          user.xpPoints += 100;
          user.coins = (user.coins || 0) + 30;
          
          // Award badges
          if (!user.badges) user.badges = [];
          const graduateBadge = `${course.name} Graduate`;
          if (!user.badges.includes(graduateBadge)) {
            user.badges.push(graduateBadge);
          }
          courseFinished = true;
        }
      }
    }

    user.level = Math.floor(user.xpPoints / 500) + 1;

    if (getIsConnected()) {
      await user.save();
    }

    res.json({
      message: 'Topic completed successfully!',
      completedTopics: user.completedTopics,
      completedChapters: user.completedChapters,
      completedCourses: user.completedCourses,
      xpPoints: user.xpPoints,
      coins: user.coins,
      level: user.level,
      badges: user.badges,
      chapterFinished,
      courseFinished
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Submit user feedback/rating/suggestions for a specific topic
 * @route   POST /api/courses/topic-feedback
 * @access  Private
 */
const submitTopicFeedback = async (req, res) => {
  const { courseId, chapterIndex, topicIndex, rating, difficulty, understood, comment } = req.body;
  const userId = req.user._id;
  const studentName = req.user.name;

  if (!courseId || chapterIndex === undefined || topicIndex === undefined || !rating || !difficulty || !understood) {
    return res.status(400).json({ message: 'Required feedback fields are missing.' });
  }

  try {
    let feed;

    if (!getIsConnected()) {
      feed = {
        _id: 'mock-tf-' + Math.random().toString(36).substr(2, 9),
        userId,
        studentName,
        courseId,
        chapterIndex: parseInt(chapterIndex),
        topicIndex: parseInt(topicIndex),
        rating: parseInt(rating),
        difficulty,
        understood,
        comment: comment || '',
        createdAt: new Date()
      };
      mockDb.topicFeedback.push(feed);
    } else {
      feed = await TopicFeedback.create({
        userId,
        studentName,
        courseId,
        chapterIndex: parseInt(chapterIndex),
        topicIndex: parseInt(topicIndex),
        rating: parseInt(rating),
        difficulty,
        understood,
        comment: comment || ''
      });
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you!',
      data: feed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getCourseNotes,
  getCourseQuiz,
  completeChapter,
  completeTopic,
  submitFeedback,
  submitTopicFeedback
};
