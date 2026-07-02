const Course = require('../models/Course');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const { getIsConnected } = require('../config/db');
const mockDb = require('../data/mockDb');
const sendEmail = async (options) => {
  try {
    const mailer = require('../utils/sendEmail');
    return await mailer(options);
  } catch (err) {
    console.error('Mail trigger failed:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * @desc    Submit quiz answers, evaluate, update gamification XP/coins and email results
 * @route   POST /api/quiz/submit
 * @access  Private
 */
const submitQuiz = async (req, res) => {
  const { courseId, answers, timeTaken, chapterIndex } = req.body;
  const userId = req.user._id;
  const chapIdx = chapterIndex !== undefined && chapterIndex !== null ? parseInt(chapterIndex) : -1;

  try {
    let course;
    let user;

    if (!getIsConnected()) {
      course = mockDb.courses.find((c) => c.courseId === courseId);
      user = mockDb.users.find((u) => u._id === userId);
    } else {
      course = await Course.findOne({ courseId });
      user = await User.findById(userId);
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let dbQuestions = [];
    let titleStr = '';

    if (chapIdx >= 0) {
      // Per-chapter quiz (exactly 25 questions)
      const chapterObj = course.chapters[chapIdx];
      if (!chapterObj) {
        return res.status(400).json({ message: 'Target chapter not found' });
      }
      dbQuestions = chapterObj.questions;
      titleStr = `${chapterObj.title} Quiz`;
    } else {
      // Course-wide final certification exam (compiling 25 representative questions from chapters)
      course.chapters.forEach((chap) => {
        if (dbQuestions.length < 25) {
          dbQuestions.push(...chap.questions.slice(0, 2));
        }
      });
      dbQuestions = dbQuestions.slice(0, 25);
      titleStr = 'Final Certification Exam';
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedQuestions = 0;

    // Evaluate answers
    dbQuestions.forEach((q, index) => {
      const submitted = answers[String(index)];
      if (submitted === undefined || submitted === null || submitted === -1) {
        skippedQuestions++;
      } else if (parseInt(submitted) === q.correctAnswer) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
    });

    const totalQuestions = dbQuestions.length;
    const marks = correctAnswers;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Passing score standard: 70%
    const passStatus = percentage >= 70;

    // Gamification values: +10 XP for correct answer, -2 XP for wrong answer (minimum 0)
    let xpEarned = correctAnswers * 10 - wrongAnswers * 2;
    if (xpEarned < 0) xpEarned = 0;

    let coinsEarned = 0;
    if (passStatus) {
      if (chapIdx >= 0) {
        coinsEarned = 10; // 10 coins for chapter quiz pass
      } else {
        coinsEarned = 50; // 50 coins for final exam pass
      }
    }

    // Badges logic
    const newBadges = [];
    if (percentage === 100) {
      newBadges.push('Perfect 100');
    }
    if (passStatus && chapIdx < 0) {
      newBadges.push(`${course.name} Graduate`);
    }

    // Update user profile parameters
    if (user) {
      user.xpPoints += xpEarned;
      user.coins = (user.coins || 0) + coinsEarned;
      user.level = Math.floor(user.xpPoints / 500) + 1; // Level up every 500 XP

      // Mark chapter completed on pass status
      if (passStatus && chapIdx >= 0) {
        const token = `${courseId}_${chapIdx}`;
        if (!user.completedChapters) user.completedChapters = [];
        if (!user.completedChapters.includes(token)) {
          user.completedChapters.push(token);
        }
      }

      // Mark course completed on final exam pass
      if (passStatus && chapIdx < 0) {
        if (!user.completedCourses) user.completedCourses = [];
        if (!user.completedCourses.includes(courseId)) {
          user.completedCourses.push(courseId);
        }
      }

      // Push new badges
      if (!user.badges) user.badges = [];
      newBadges.forEach((badge) => {
        if (!user.badges.includes(badge)) {
          user.badges.push(badge);
        }
      });

      // Save changes if standard DB
      if (getIsConnected()) {
        await user.save();
      }
    }

    // Save Quiz Result
    let quizResult;
    if (!getIsConnected()) {
      quizResult = {
        _id: 'mock-res-' + Math.random().toString(36).substr(2, 9),
        userId,
        studentName: user ? user.name : 'Student',
        courseId,
        courseName: course.name,
        chapterIndex: chapIdx,
        chapterTitle: titleStr,
        marks,
        totalQuestions,
        percentage,
        correctAnswers,
        wrongAnswers,
        skippedQuestions,
        timeTaken,
        performanceLevel: percentage >= 80 ? 'Outstanding' : (percentage >= 50 ? 'Good' : 'Needs Improvement'),
        passStatus,
        createdAt: new Date()
      };
      mockDb.quizResults.unshift(quizResult);
    } else {
      quizResult = await QuizResult.create({
        userId,
        studentName: user ? user.name : 'Student',
        courseId,
        courseName: course.name,
        chapterIndex: chapIdx,
        chapterTitle: titleStr,
        marks,
        totalQuestions,
        percentage,
        correctAnswers,
        wrongAnswers,
        skippedQuestions,
        timeTaken,
        performanceLevel: percentage >= 80 ? 'Outstanding' : (percentage >= 50 ? 'Good' : 'Needs Improvement'),
        passStatus
      });
    }

    // Email scorecard dispatch
    if (user && user.email) {
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px;">
          <h2 style="color: #4f46e5; text-align: center;">Quiz Scorecard: ${titleStr}</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>You completed the assessment for <strong>${course.name}</strong> with the following metrics:</p>
          <ul>
            <li>Score: <strong>${marks} / ${totalQuestions}</strong></li>
            <li>Percentage: <strong>${percentage}%</strong></li>
            <li>Status: <strong>${passStatus ? 'PASSED' : 'FAILED'}</strong></li>
            <li>XP Earned: <strong>+${xpEarned} XP</strong></li>
            <li>Coins Earned: <strong>+${coinsEarned} Coins</strong></li>
          </ul>
          <p style="font-style: italic; color: #6b7280;">"Keep learning, keep growing!"</p>
        </div>
      `;

      sendEmail({
        email: user.email,
        subject: `EduQuiz Scorecard - ${course.name} - ${percentage}%`,
        message: `Hi ${user.name}, you scored ${marks}/${totalQuestions} on the ${titleStr}.`,
        html: emailHtml
      }).catch(err => console.error('Error firing email:', err.message));
    }

    res.status(201).json({
      result: quizResult,
      xpEarned,
      coinsEarned,
      newBadges,
      questions: dbQuestions,
      userLevel: user ? user.level : 1,
      userCoins: user ? user.coins : 0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user's past quiz results
 * @route   GET /api/quiz/history
 * @access  Private
 */
const getQuizHistory = async (req, res) => {
  try {
    if (!getIsConnected()) {
      const results = mockDb.quizResults.filter((r) => r.userId === req.user._id);
      return res.json(results);
    }

    const results = await QuizResult.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitQuiz,
  getQuizHistory
};
