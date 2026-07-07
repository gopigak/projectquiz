import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeNotes, setActiveNotes] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchFavorites = async () => {
    try {
      const { data } = await API.get('/favorites');
      if (Array.isArray(data)) {
        const questionBookmarks = data.filter(f => f.type === 'question').map(f => f.item);
        setBookmarks(questionBookmarks);
        
        const chapterBookmarks = data.filter(f => f.type === 'chapter').map(f => f.item);
        localStorage.setItem('notes_bookmarks', JSON.stringify(chapterBookmarks));
      }
    } catch (error) {
      console.warn('Failed to fetch bookmarks from server:', error.message);
    }
  };

  // Sync bookmarks changes with local storage
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      fetchFavorites();
    }
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/courses');
      setCourses(data);
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        fetchFavorites();
      }
    } catch (error) {
      console.error('Failed to load courses:', error.message);
      toast.error('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/courses/${courseId}`);
      setActiveCourse(data);
      return data;
    } catch (error) {
      console.error(`Failed to load details for ${courseId}:`, error.message);
      toast.error('Error fetching course details.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseNotes = async (courseId) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/courses/${courseId}/notes`);
      setActiveNotes(data);
      return data;
    } catch (error) {
      console.error(`Failed to load notes for ${courseId}:`, error.message);
      toast.error('Error loading notes.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseQuiz = async (courseId, chapterIndex = -1) => {
    setLoading(true);
    try {
      const url = chapterIndex >= 0 
        ? `/courses/${courseId}/quiz?chapterIndex=${chapterIndex}`
        : `/courses/${courseId}/quiz`;
      const { data } = await API.get(url);
      setActiveQuiz(data);
      return data;
    } catch (error) {
      console.error(`Failed to load quiz for ${courseId}:`, error.message);
      toast.error('Error loading quiz questions.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitQuizAnswers = async (courseId, answers, timeTaken, chapterIndex = -1) => {
    setLoading(true);
    try {
      const { data } = await API.post('/quiz/submit', {
        courseId,
        answers,
        timeTaken,
        chapterIndex,
      });
      fetchQuizHistory();
      return data;
    } catch (error) {
      console.error('Failed to submit quiz:', error.message);
      toast.error('Quiz submission failed. Please verify internet connection.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitTopicCompletion = async (courseId, chapterIndex, topicIndex) => {
    setLoading(true);
    try {
      const { data } = await API.post('/courses/complete-topic', {
        courseId,
        chapterIndex,
        topicIndex
      });
      return data;
    } catch (error) {
      console.error('Failed to complete topic:', error.message);
      toast.error(error.response?.data?.message || 'Failed to update topic progress.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitTopicFeedback = async (feedbackData) => {
    setLoading(true);
    try {
      const { data } = await API.post('/courses/topic-feedback', feedbackData);
      return data;
    } catch (error) {
      console.error('Failed to submit topic feedback:', error.message);
      toast.error('Failed to save feedback.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const syncLearningTime = async (minutes) => {
    try {
      const { data } = await API.post('/auth/learning-time', { minutes });
      return data;
    } catch (error) {
      console.error('Failed to sync learning time:', error.message);
      return null;
    }
  };

  const fetchQuizHistory = async () => {
    try {
      const { data } = await API.get('/quiz/history');
      setQuizHistory(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch quiz history:', error.message);
      return [];
    }
  };

  const fetchOverallLeaderboard = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/leaderboard');
      setLeaderboard(data);
      return data;
    } catch (error) {
      console.error('Failed to load global leaderboard:', error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseLeaderboard = async (courseId) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/leaderboard/${courseId}`);
      setLeaderboard(data);
      return data;
    } catch (error) {
      console.error(`Failed to load leaderboard for ${courseId}:`, error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Bookmarking operations
  const toggleBookmark = async (questionObj) => {
    const isBookmarked = bookmarks.some((q) => q.questionText === questionObj.questionText);
    if (isBookmarked) {
      setBookmarks((prev) => prev.filter((q) => q.questionText !== questionObj.questionText));
      toast.success('Removed question from bookmarks.');
    } else {
      setBookmarks((prev) => [...prev, questionObj]);
      toast.success('Added question to bookmarks! 📌');
    }

    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        await API.post('/favorites', {
          type: 'question',
          item: questionObj
        });
      }
    } catch (error) {
      console.warn('Failed to sync bookmark with server:', error.message);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        activeCourse,
        activeNotes,
        activeQuiz,
        quizHistory,
        leaderboard,
        bookmarks,
        loading,
        fetchCourses,
        fetchCourseDetails,
        fetchCourseNotes,
        fetchCourseQuiz,
        submitQuizAnswers,
        submitTopicCompletion,
        submitTopicFeedback,
        syncLearningTime,
        fetchQuizHistory,
        fetchOverallLeaderboard,
        fetchCourseLeaderboard,
        toggleBookmark,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
