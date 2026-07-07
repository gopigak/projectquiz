import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import NoteCard from '../components/NoteCard';
import ProgressBar from '../components/ProgressBar';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaGraduationCap, 
  FaListUl, 
  FaTimes,
  FaClock,
  FaTag,
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaPrint,
  FaLock,
  FaCheckCircle,
  FaAward,
  FaBookOpen,
  FaStar,
  FaCheck
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '../services/api';

const Notes = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    activeNotes, 
    fetchCourseNotes, 
    submitTopicCompletion, 
    submitTopicFeedback,
    loading 
  } = useCourse();
  const { user, fetchUserProfile } = useAuth();
  
  const [activeChapterIndex, setActiveChapterIndex] = useState(() => {
    return location.state?.chapterIndex !== undefined ? parseInt(location.state.chapterIndex) : 0;
  });
  
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  
  // Modals / Overlays States
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showChapterComplete, setShowChapterComplete] = useState(false);
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  // Topic Feedback Form Fields
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackDifficulty, setFeedbackDifficulty] = useState('Medium');
  const [feedbackUnderstood, setFeedbackUnderstood] = useState('Yes');
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => {
    fetchCourseNotes(id);
    const saved = localStorage.getItem('notes_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, [id]);

  // Sync activeTopicIndex to the first uncompleted topic of the chapter
  useEffect(() => {
    if (user && activeNotes) {
      let firstUncompleted = 0;
      for (let t = 0; t < 4; t++) {
        if (!user.completedTopics?.includes(`${id}_${activeChapterIndex}_${t}`)) {
          firstUncompleted = t;
          break;
        }
        if (t === 3) {
          firstUncompleted = 3; // if all are completed, stay on the last topic
        }
      }
      setActiveTopicIndex(firstUncompleted);
    }
  }, [activeChapterIndex, user?.completedTopics, activeNotes]);

  if (loading || !activeNotes || activeNotes.courseId !== id) {
    return <Loader />;
  }

  const { name, chapters = [] } = activeNotes || {};
  const chaptersList = Array.isArray(chapters) ? chapters : [];
  const activeChapter = chaptersList[activeChapterIndex];

  if (!activeChapter) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400 italic">No chapters available in this course syllabus.</p>
      </div>
    );
  }

  const isLastChapter = activeChapterIndex === chaptersList.length - 1;
  const isLastTopic = activeTopicIndex === 3;

  // Bookmarks check
  const bookmarkKey = `${id}_chap_${activeChapterIndex}`;
  const isBookmarked = bookmarks.includes(bookmarkKey);

  const handleToggleBookmark = async () => {
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter(b => b !== bookmarkKey);
      toast.success('Chapter removed from bookmarks! 🔖');
    } else {
      updated = [...bookmarks, bookmarkKey];
      toast.success('Chapter added to bookmarks! 📌');
    }
    setBookmarks(updated);
    localStorage.setItem('notes_bookmarks', JSON.stringify(updated));

    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        await API.post('/favorites', {
          type: 'chapter',
          item: bookmarkKey
        });
      }
    } catch (error) {
      console.warn('Failed to sync chapter bookmark with server:', error.message);
    }
  };

  // Completion statuses
  const isTopicCompleted = (tIdx) => {
    return (user?.completedTopics || []).includes(`${id}_${activeChapterIndex}_${tIdx}`);
  };

  const isTopicUnlocked = (tIdx) => {
    if (tIdx === 0) return true;
    return isTopicCompleted(tIdx - 1);
  };

  const isChapterCompleted = (cIdx) => {
    return (user?.completedChapters || []).includes(`${id}_${cIdx}`);
  };

  const isChapterUnlocked = (cIdx) => {
    if (cIdx === 0) return true;
    return isChapterCompleted(cIdx - 1);
  };

  const courseCompletionPercentage = Math.round(
    ((user?.completedTopics?.filter(t => t.startsWith(id))?.length || 0) / (chapters.length * 4)) * 100
  );

  // Actions
  const handleMarkTopicCompleted = () => {
    // Open feedback popup modal before complete
    setFeedbackRating(5);
    setFeedbackDifficulty('Medium');
    setFeedbackUnderstood('Yes');
    setFeedbackComment('');
    setShowFeedbackModal(true);
  };

  const submitCompletion = async (skipFeedback = false) => {
    setShowFeedbackModal(false);
    
    // Save feedback if not skipped
    if (!skipFeedback) {
      await submitTopicFeedback({
        courseId: id,
        chapterIndex: activeChapterIndex,
        topicIndex: activeTopicIndex,
        rating: feedbackRating,
        difficulty: feedbackDifficulty,
        understood: feedbackUnderstood,
        comment: feedbackComment
      });
    }

    // Call topic completion endpoint
    const result = await submitTopicCompletion(id, activeChapterIndex, activeTopicIndex);
    if (result) {
      await fetchUserProfile();
      
      let rewardText = '+5 XP & +2 Coins earned!';
      if (result.chapterFinished) {
        rewardText = 'Chapter completed! +20 XP & +7 Coins earned! 🚀';
      }
      if (result.courseFinished) {
        rewardText = 'Course completed! +120 XP & +37 Coins earned! 🎓🏆';
      }
      
      toast.success(`Topic completed successfully! ${rewardText}`);

      // Progression overlays
      if (result.courseFinished) {
        setShowCourseComplete(true);
      } else if (result.chapterFinished) {
        setShowChapterComplete(true);
      } else {
        // Unlock next topic, automatically move to next topic
        setActiveTopicIndex(prev => Math.min(3, prev + 1));
      }
    }
  };

  const handleNextChapterFromOverlay = () => {
    setShowChapterComplete(false);
    if (activeChapterIndex < chapters.length - 1) {
      setActiveChapterIndex(prev => prev + 1);
      setActiveTopicIndex(0);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (activeTopicIndex > 0) {
      setActiveTopicIndex(prev => prev - 1);
    } else if (activeChapterIndex > 0) {
      setActiveChapterIndex(prev => prev - 1);
      setActiveTopicIndex(3);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (activeTopicIndex < 3) {
      if (isTopicCompleted(activeTopicIndex)) {
        setActiveTopicIndex(prev => prev + 1);
      } else {
        toast.error('Complete the current topic to proceed.');
      }
    } else if (activeChapterIndex < chapters.length - 1) {
      if (isChapterCompleted(activeChapterIndex)) {
        setActiveChapterIndex(prev => prev + 1);
        setActiveTopicIndex(0);
        window.scrollTo(0, 0);
      } else {
        toast.error('Complete all topics inside this chapter to unlock the next chapter.');
      }
    }
  };

  const allChaptersFinished = chapters.every((_, idx) => isChapterCompleted(idx));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Share link copied to clipboard! 🔗');
  };

  // Render Topic Steps Navigator
  const renderTopicSteps = () => {
    const topicsMeta = [
      { name: 'Concept & Overview', icon: '📖' },
      { name: 'Syntax Rules', icon: '📝' },
      { name: 'Sandbox Coding', icon: '💻' },
      { name: 'Assessment & Tips', icon: '🎓' }
    ];

    return (
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none shrink-0">
          Topics Progress
        </span>
        <div className="flex flex-wrap md:flex-nowrap items-center w-full justify-between gap-2">
          {topicsMeta.map((topic, idx) => {
            const isActive = activeTopicIndex === idx;
            const isCompleted = isTopicCompleted(idx);
            const isUnlocked = isTopicUnlocked(idx);

            return (
              <button
                key={idx}
                disabled={!isUnlocked}
                onClick={() => setActiveTopicIndex(idx)}
                className={`flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-650 shadow-md shadow-indigo-500/10'
                    : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450 border-emerald-200 dark:border-emerald-900/30'
                      : isUnlocked
                        ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                        : 'bg-slate-100 dark:bg-slate-950/50 text-slate-400 border-slate-200/50 dark:border-slate-900 cursor-not-allowed opacity-50'
                }`}
              >
                <span>{topic.icon}</span>
                <span className="truncate hidden sm:inline">{topic.name}</span>
                {isCompleted ? (
                  <FaCheckCircle className="text-emerald-500 text-[10px]" />
                ) : !isUnlocked ? (
                  <FaLock className="text-slate-400 text-[9px]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Navigation Row */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link
          to={`/courses/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <FaArrowLeft className="text-[10px]" /> Back to Syllabus Overview
        </Link>
        <span className="text-xs font-bold text-slate-400">
          Course Track: <span className="text-indigo-650 dark:text-indigo-400 font-extrabold">{name}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative">
        
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-xl flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-all border border-indigo-400"
        >
          <FaListUl />
        </button>

        {/* Left Sidebar Chapter Index (Desktop view) */}
        <div className="hidden lg:block lg:col-span-1 space-y-4 sticky top-24 h-[calc(100vh-140px)] overflow-y-auto pr-2 select-none">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
            Course Chapters
          </h3>
          <div className="glass-panel p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 bg-white/70 dark:bg-slate-900/60">
            {chaptersList.map((chap, idx) => {
              const isActive = activeChapterIndex === idx;
              const isUnlocked = isChapterUnlocked(idx);
              const isDone = isChapterCompleted(idx);
              
              return (
                <button
                  key={idx}
                  disabled={!isUnlocked}
                  onClick={() => {
                    setActiveChapterIndex(idx);
                    setMobileSidebarOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 border-l-3 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 border-l-indigo-600 shadow-xs'
                      : isUnlocked
                        ? 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-transparent'
                        : 'opacity-40 cursor-not-allowed text-slate-400 border-l-transparent'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 ${isActive ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
                    {idx + 1}
                  </span>
                  <span className="truncate">{chap.title}</span>
                  {!isUnlocked && <FaLock className="ml-auto text-[9px] text-slate-400" />}
                  {isUnlocked && isDone && <FaCheckCircle className="ml-auto text-emerald-500 text-xs" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Left Sidebar Chapter Index Drawer (Mobile view) */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end lg:hidden animate-fade-in">
            <div className="w-80 h-full bg-white dark:bg-slate-900 p-6 flex flex-col space-y-6 shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-slide-in">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="font-black text-sm text-slate-800 dark:text-slate-200">Chapters Guide</h3>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-550 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-1">
                {chaptersList.map((chap, idx) => {
                  const isActive = activeChapterIndex === idx;
                  const isUnlocked = isChapterUnlocked(idx);
                  const isDone = isChapterCompleted(idx);
                  
                  return (
                    <button
                      key={idx}
                      disabled={!isUnlocked}
                      onClick={() => {
                        setActiveChapterIndex(idx);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : isUnlocked
                            ? 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            : 'opacity-40 cursor-not-allowed text-slate-400'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${isActive ? 'bg-white/25' : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
                        {idx + 1}
                      </span>
                      <span className="truncate">{chap.title}</span>
                      {!isUnlocked && <FaLock className="ml-auto text-[9px] text-slate-300" />}
                      {isUnlocked && isDone && <FaCheckCircle className="ml-auto text-emerald-400 text-xs" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Chapter Notes Details & Completion Status */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Progress bar & toolbar info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs sm:col-span-2">
              <ProgressBar 
                current={courseCompletionPercentage} 
                total={100} 
                label="Course Progress" 
              />
            </div>
            
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-around text-xs select-none">
              <span className="flex items-center gap-1.5 text-slate-500 font-bold">
                <FaClock className="text-indigo-500" />
                {Math.max(1, Math.round((activeChapter?.explanation?.split(' ').length || 150) / 100))} min read
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 font-bold px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 uppercase border border-slate-200 dark:border-slate-800">
                <FaTag className="text-slate-400" /> {activeNotes.difficulty || 'Easy'}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs text-xs select-none">
            <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Actions:</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleBookmark}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-slate-550 cursor-pointer flex items-center gap-1.5"
              >
                {isBookmarked ? <FaBookmark className="text-indigo-500" /> : <FaRegBookmark />}
                <span className="font-bold hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-slate-550 cursor-pointer flex items-center gap-1.5"
              >
                <FaShareAlt className="text-indigo-500" />
                <span className="font-bold hidden sm:inline">Share Link</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-slate-550 cursor-pointer flex items-center gap-1.5"
              >
                <FaPrint className="text-indigo-500" />
                <span className="font-bold hidden sm:inline">Print Page</span>
              </button>
            </div>
          </div>

          {/* Render Topics step list */}
          {renderTopicSteps()}

          {/* Active Note Card rendering only specific topic content */}
          {activeChapter ? (
            <NoteCard chapter={activeChapter} activeTopicIndex={activeTopicIndex} />
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl">
              <p className="text-slate-400 text-xs italic">Chapter notes contents not available.</p>
            </div>
          )}

          {/* Topic Completion Control Panel */}
          <div className="p-5 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-150 dark:border-indigo-900/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="font-bold text-slate-800 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                <span>Topic Completion Status</span>
                {isTopicCompleted(activeTopicIndex) && <FaCheckCircle className="text-emerald-500" />}
              </p>
              <p className="text-[10px] text-slate-400">Marking this topic completed awards +5 XP & +2 Coins and unlocks the next element.</p>
            </div>
            
            {isTopicCompleted(activeTopicIndex) ? (
              <span className="px-4 py-2.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 font-extrabold rounded-xl flex items-center gap-1.5 select-none animate-pulse">
                ✓ Topic Completed (+5 XP)
              </span>
            ) : (
              <button
                onClick={handleMarkTopicCompleted}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-650 hover:opacity-90 text-white font-extrabold rounded-xl transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer select-none flex items-center gap-1.5"
              >
                <FaCheck /> Mark as Completed
              </button>
            )}
          </div>

          {/* Bottom Control Buttons */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <button
              onClick={handlePrev}
              disabled={activeChapterIndex === 0 && activeTopicIndex === 0}
              className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 flex items-center gap-1.5 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
            >
              <FaArrowLeft className="text-[10px]" /> Previous Topic
            </button>

            {isLastChapter && isLastTopic ? (
              <button
                disabled={!allChaptersFinished}
                onClick={() => navigate(`/courses/${id}/cert-test`)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  allChaptersFinished 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-650 hover:opacity-90 text-white' 
                    : 'bg-slate-100 dark:bg-slate-850 text-slate-400 border border-slate-250 dark:border-slate-800 cursor-not-allowed opacity-50'
                }`}
                title={allChaptersFinished ? 'Launch certification exam' : 'Complete all preceding chapters & topics to unlock exam'}
              >
                <FaGraduationCap className="text-sm" /> 
                {allChaptersFinished ? 'Start Certificate Test' : 'Certificate Test Locked 🔒'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Next Topic <FaArrowRight className="text-[10px]" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* TOPIC FEEDBACK POPUP MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="glass-panel max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Topic Complete! 🎉</h3>
                <p className="text-xs text-slate-400 mt-1">Please leave a quick review to help improve the syllabus content.</p>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Stars Rating (1-5) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rate this topic</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className="text-2xl cursor-pointer transition-all hover:scale-110"
                    type="button"
                  >
                    <FaStar className={star <= feedbackRating ? 'text-yellow-450' : 'text-slate-200 dark:text-slate-850'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty rating dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">How easy was this topic?</label>
              <select
                value={feedbackDifficulty}
                onChange={(e) => setFeedbackDifficulty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-hidden text-slate-800 dark:text-white"
              >
                <option value="Very Easy">Very Easy</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Very Hard">Very Hard</option>
              </select>
            </div>

            {/* Did you understand selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Did you understand the topic?</label>
              <div className="flex gap-3">
                {['Yes', 'Partially', 'No'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFeedbackUnderstood(option)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      feedbackUnderstood === option
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900'
                        : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350'
                    }`}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional comments text area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Additional comments (Optional)</label>
              <textarea
                rows="3"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Share your thoughts or suggestions here..."
                className="w-full p-3 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-hidden text-slate-800 dark:text-white resize-none"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => submitCompletion(true)}
                className="flex-1 py-3 border border-slate-250 dark:border-slate-800 text-slate-655 dark:text-slate-350 font-bold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-all"
                type="button"
              >
                Skip Feedback
              </button>
              <button
                onClick={() => submitCompletion(false)}
                className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-indigo-500/10 transition-all"
                type="button"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER COMPLETION OVERLAY */}
      {showChapterComplete && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="glass-panel max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 space-y-6 text-center shadow-2xl animate-scale-in">
            <span className="text-6xl select-none">🎉</span>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Chapter Completed!</h3>
              <p className="text-sm text-slate-455 dark:text-slate-400">
                Congratulations, you've conquered all 4 topics of <strong>Chapter {activeChapterIndex + 1}</strong>!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 select-none">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Topics Finished</p>
                <p className="text-lg font-black text-slate-800 dark:text-white mt-1">4 / 4 Topics</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chapter Bonus</p>
                <p className="text-lg font-black text-emerald-500 dark:text-emerald-400 mt-1">+20 XP ⭐</p>
              </div>
            </div>

            <button
              onClick={handleNextChapterFromOverlay}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-705 text-white font-extrabold rounded-2xl text-sm transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              Continue to Next Chapter <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      )}

      {/* COURSE COMPLETION CELEBRATION OVERLAY */}
      {showCourseComplete && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="glass-panel max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 text-center shadow-2xl animate-scale-in my-8">
            <span className="text-7xl select-none animate-bounce block">🏆</span>
            
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] uppercase tracking-wider">
                100% Curriculum Completed
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">🎉 Course Finished!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                You have successfully completed every chapter and topic in the <strong>{name}</strong> training course. Great job!
              </p>
            </div>

            {/* Overall Statistics block */}
            <div className="grid grid-cols-2 gap-4 text-xs select-none">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <p className="font-bold text-slate-400">Chapters Completed</p>
                <p className="text-base font-black text-slate-800 dark:text-white mt-1">{chapters.length} Chapters</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <p className="font-bold text-slate-400">Topics Completed</p>
                <p className="text-base font-black text-slate-800 dark:text-white mt-1">{chapters.length * 4} Topics</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <p className="font-bold text-slate-400">Total Learning Time</p>
                <p className="text-base font-black text-slate-800 dark:text-white mt-1">
                  {user?.totalLearningTime || 0} minutes
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <p className="font-bold text-slate-400">Completion Date</p>
                <p className="text-base font-black text-slate-800 dark:text-white mt-1">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-2xl text-xs space-y-1">
              <p className="font-extrabold text-indigo-750 dark:text-indigo-400">🏆 Certificate Exam Unlocked!</p>
              <p className="text-slate-400">You must pass the final multiple-choice exam (score &ge; 70%) to generate and download your dynamic certificate.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold text-slate-700 dark:text-slate-200 text-xs transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setShowCourseComplete(false);
                  navigate(`/courses/${id}/cert-test`);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-650 hover:opacity-90 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FaGraduationCap className="text-sm animate-pulse" /> Start Exam Test
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notes;
export { Notes };
