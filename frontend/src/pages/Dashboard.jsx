import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCourse } from '../hooks/useCourse';
import { 
  FaUserGraduate, 
  FaFire, 
  FaStar, 
  FaAward, 
  FaHistory, 
  FaArrowRight, 
  FaBookOpen,
  FaCheckCircle,
  FaCoins,
  FaClock,
  FaLock,
  FaLockOpen,
  FaCertificate,
  FaClipboardList,
  FaLightbulb
} from 'react-icons/fa';
import Loader from '../components/Loader';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  const { user, fetchUserProfile } = useAuth();
  const { 
    courses, 
    quizHistory, 
    fetchCourses, 
    fetchQuizHistory, 
    loading 
  } = useCourse();

  useEffect(() => {
    fetchUserProfile();
    fetchCourses();
    fetchQuizHistory();
  }, []);

  if (loading || !user || !Array.isArray(courses) || courses.length === 0) {
    return <Loader />;
  }

  // Active courses processing
  const courseProgressList = Array.isArray(courses) ? courses.map(course => {
    const totalChapters = course.chaptersCount || 0;
    const completedChaptersForCourse = Array.isArray(user.completedChapters) ? user.completedChapters.filter(c => c.startsWith(course.courseId)) : [];
    const completedTopicsForCourse = Array.isArray(user.completedTopics) ? user.completedTopics.filter(t => t.startsWith(course.courseId)) : [];
    
    const chaptersCount = completedChaptersForCourse.length;
    const topicsCount = completedTopicsForCourse.length;
    
    // Topics count is total chapters * 4 topics
    const totalTopics = totalChapters * 4;
    const progressPercent = totalTopics > 0 ? Math.round((topicsCount / totalTopics) * 100) : 0;
    
    const hasPassedFinal = Array.isArray(quizHistory) && quizHistory.some(r => r.courseId === course.courseId && r.chapterIndex === -1 && r.passStatus === true);

    return {
      ...course,
      completedChaptersCount: chaptersCount,
      completedTopicsCount: topicsCount,
      totalTopics,
      progressPercent,
      isFinished: progressPercent === 100,
      hasPassedFinal
    };
  }) : [];

  // Find current course: first course with progress > 0 and < 100, fallback to first course
  const currentCourse = courseProgressList.find(c => c.progressPercent > 0 && c.progressPercent < 100) || courseProgressList[0];

  const totalXP = user.xpPoints || 0;
  const streak = user.streakCount || 0;
  const badges = user.badges || [];
  const coins = user.coins || 0;
  const level = user.level || 1;

  // Learning Time Metrics
  const todayMins = user.learningTimeToday || 0;
  const totalHours = Math.round((user.totalLearningTime || 0) / 60 * 10) / 10;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Welcome Hero Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg select-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name}! 🚀
            </h2>
            <p className="text-indigo-100 text-sm max-w-md">
              Your learning track is saved and synced. Continue studying topics, sandboxing code, and unlocking certificates!
            </p>
          </div>
          
          {/* Quick Metrics display */}
          <div className="flex flex-wrap gap-4 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center space-x-2">
              <FaFire className="text-orange-400 animate-pulse text-lg" />
              <div>
                <p className="text-xs text-indigo-100 font-bold uppercase tracking-wider">Streak</p>
                <p className="font-extrabold text-sm">{streak} Days</p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center space-x-2">
              <FaStar className="text-yellow-300 text-lg" />
              <div>
                <p className="text-xs text-indigo-100 font-bold uppercase tracking-wider">Points</p>
                <p className="font-extrabold text-sm">{totalXP} XP</p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center space-x-2">
              <FaCoins className="text-amber-300 text-lg" />
              <div>
                <p className="text-xs text-indigo-100 font-bold uppercase tracking-wider">Coins</p>
                <p className="font-extrabold text-sm">{coins} Coins</p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center space-x-2">
              <FaUserGraduate className="text-rose-350 text-lg" />
              <div>
                <p className="text-xs text-indigo-100 font-bold uppercase tracking-wider">Level</p>
                <p className="font-extrabold text-sm">Lvl {level}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.04] pointer-events-none"></div>
      </div>

      {/* 2. Grid: Granular Learning Time Stats & Lock indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        
        {/* Today's time */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center shrink-0">
            <FaClock className="text-lg animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Learning Today</p>
            <p className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{todayMins} Mins</p>
          </div>
        </div>

        {/* Total time */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center shrink-0">
            <FaBookOpen className="text-lg" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Duration</p>
            <p className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{totalHours} Hours</p>
          </div>
        </div>

        {/* Certificate Test unlock status */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            currentCourse.progressPercent === 100 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500' 
              : 'bg-slate-100 dark:bg-slate-850 text-slate-400'
          }`}>
            {currentCourse.progressPercent === 100 ? <FaLockOpen className="text-lg" /> : <FaLock className="text-lg" />}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Final Test Status</p>
            <p className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
              {currentCourse.progressPercent === 100 ? 'Unlocked 🔓' : 'Locked 🔒'}
            </p>
          </div>
        </div>

        {/* Certificate Status */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            currentCourse.hasPassedFinal 
              ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500' 
              : 'bg-slate-100 dark:bg-slate-850 text-slate-400'
          }`}>
            <FaCertificate className="text-lg" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Certificate Status</p>
            <p className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
              {currentCourse.hasPassedFinal ? 'Available 🏆' : 'Locked 🔒'}
            </p>
          </div>
        </div>

      </div>

      {/* 3. Grid: Active Course Progress & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Active Course Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3 select-none">
            <div className="flex items-center space-x-2">
              <FaClipboardList className="text-indigo-500 text-lg" />
              <h3 className="font-extrabold text-slate-855 dark:text-white text-base">Active Course Tracker</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold uppercase">
              Current Target
            </span>
          </div>

          {currentCourse && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">{currentCourse.name} Curriculum</h4>
                  <p className="text-xs text-slate-400">
                    Syllabus Level: {currentCourse.difficulty} | Chapters: {currentCourse.chaptersCount}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    to={`/courses/${currentCourse.courseId}`}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all shadow-2xs"
                  >
                    View Syllabus
                  </Link>
                  <Link
                    to={`/courses/${currentCourse.courseId}/notes`}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-705 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-1"
                  >
                    Continue Study <FaArrowRight className="text-[9px]" />
                  </Link>
                </div>
              </div>

              {/* Progress Metrics breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl text-center">
                  <p className="text-slate-400 font-bold">Topics Finished</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-1">
                    {currentCourse.completedTopicsCount} / {currentCourse.totalTopics}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl text-center">
                  <p className="text-slate-400 font-bold">Remaining Topics</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-1">
                    {currentCourse.totalTopics - currentCourse.completedTopicsCount} Topics
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl text-center">
                  <p className="text-slate-400 font-bold">Chapters Unlocked</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-1">
                    {currentCourse.completedChaptersCount + 1} Chapters
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl text-center">
                  <p className="text-slate-400 font-bold">Remaining Chapters</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-1">
                    {currentCourse.chaptersCount - currentCourse.completedChaptersCount} Chapters
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <ProgressBar 
                current={currentCourse.progressPercent} 
                total={100} 
                label={`${currentCourse.name} Progression`} 
              />
            </div>
          )}
        </div>

        {/* Achievements & Badges Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3 select-none">
            <FaAward className="text-indigo-500 text-lg" />
            <h3 className="font-extrabold text-slate-850 dark:text-white text-base">Achievements & Badges</h3>
          </div>

          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-[170px] overflow-y-auto pr-1">
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-350 shadow-2xs select-none"
                >
                  <span>🏆</span>
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic">Complete quizzes to unlock achievements and badges.</p>
          )}
        </div>

      </div>

      {/* 4. Grid: Quiz History & Dynamic certificate link card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Continue Learning shortcuts */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3 select-none">
            <div className="flex items-center space-x-2">
              <FaLightbulb className="text-indigo-500 text-lg" />
              <h3 className="font-extrabold text-slate-855 dark:text-white text-base">Course Certifications Available</h3>
            </div>
            <Link to="/courses" className="text-xs font-bold text-indigo-650 hover:underline">All Courses</Link>
          </div>

          <div className="space-y-3.5">
            {courseProgressList.slice(0, 3).map((item) => (
              <div 
                key={item.courseId}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 hover:bg-slate-50/60 dark:hover:bg-slate-850 flex items-center justify-between transition-all"
              >
                <div className="space-y-1">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-250 flex items-center gap-2">
                    <span>{item.name} Path</span>
                    {item.hasPassedFinal && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-450 font-bold uppercase">
                        Certified
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">
                    Progress: {item.progressPercent}% | {item.completedChaptersCount} / {item.chaptersCount} Chapters Finished
                  </p>
                </div>
                
                {item.hasPassedFinal ? (
                  <Link 
                    to={`/courses/${item.courseId}/certificate`} 
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 select-none"
                  >
                    View Certificate 🏆
                  </Link>
                ) : item.progressPercent === 100 ? (
                  <Link 
                    to={`/courses/${item.courseId}/cert-test`} 
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 select-none font-extrabold animate-pulse"
                  >
                    Start Test 🎓
                  </Link>
                ) : (
                  <Link 
                    to={`/courses/${item.courseId}/notes`} 
                    className="text-xs font-bold text-slate-500 hover:underline flex items-center gap-1 select-none"
                  >
                    Continue Notes &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quiz History table/list */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3 select-none">
            <FaHistory className="text-indigo-500 text-lg" />
            <h3 className="font-extrabold text-slate-855 dark:text-white text-base">Recent Activities</h3>
          </div>

          {Array.isArray(quizHistory) && quizHistory.length > 0 ? (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {quizHistory.map((hist, index) => (
                <div 
                  key={hist._id || index}
                  className="p-3 rounded-xl border border-slate-150 dark:border-slate-850 flex justify-between items-center text-xs shadow-2xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-805 dark:text-slate-200">{hist.courseName}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{hist.chapterTitle}</p>
                    <p className="text-[9px] text-slate-400">{new Date(hist.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right space-y-1 select-none">
                    <p className="font-extrabold text-slate-850 dark:text-slate-200">{hist.percentage}%</p>
                    <span 
                      className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        hist.passStatus 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-450' 
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {hist.passStatus ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic">No quiz attempts yet. Start learning a course above!</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
export { Dashboard };
