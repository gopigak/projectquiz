import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCourse } from '../hooks/useCourse';
import Loader from '../components/Loader';
import { FaUser, FaEnvelope, FaCalendarAlt, FaFire, FaStar, FaAward, FaHistory, FaDownload, FaCertificate } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, fetchUserProfile } = useAuth();
  const { quizHistory, fetchQuizHistory } = useCourse();

  useEffect(() => {
    fetchUserProfile();
    fetchQuizHistory();
  }, []);

  if (!user) {
    return <Loader />;
  }

  // Filter out passing quiz results that qualify for a certificate (>= 75%)
  const certifiedResults = quizHistory.filter((hist) => hist.percentage >= 75);

  const handleDownloadCertificate = (hist) => {
    // Navigates directly to the results certificate layout for printing
    toast.success(`Redirecting to certificate for ${hist.courseName}...`);
    window.location.href = `/courses/${hist.courseId}/result`;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Profile Overview Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Avatar Ring */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shrink-0 select-none">
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* User Meta details */}
          <div className="space-y-3.5 flex-grow text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-855 dark:text-white">
              {user.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><FaEnvelope className="text-indigo-500" /> {user.email}</span>
              <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-indigo-500" /> Member since June 2026</span>
            </div>

            {/* Quick Stat tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3.5 pt-2">
              <div className="px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-655 dark:text-orange-400 text-xs font-bold flex items-center gap-1">
                <FaFire className="text-orange-500" /> {user.streakCount || 0} Streak Days
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-450 text-xs font-bold flex items-center gap-1">
                <FaStar className="text-indigo-500" /> {user.xpPoints || 0} Total XP
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Grid: Certificates and Badges list */}
        <div className="space-y-6">
          {/* Certificates Shelf */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FaCertificate className="text-indigo-500 text-xl" />
              <h3 className="font-extrabold text-slate-855 dark:text-white text-base">Earned Certificates</h3>
            </div>

            {certifiedResults.length > 0 ? (
              <div className="space-y-3">
                {certifiedResults.map((cert, index) => (
                  <div
                    key={cert._id || index}
                    className="p-3.5 rounded-xl border border-slate-150 dark:border-slate-850 bg-slate-50/20 hover:bg-slate-50/60 dark:hover:bg-slate-850 flex justify-between items-center transition-all"
                  >
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{cert.courseName}</p>
                      <p className="text-[10px] text-slate-400">Score: {cert.percentage}% | Passed</p>
                    </div>
                    <button
                      onClick={() => handleDownloadCertificate(cert)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="Download PDF Certificate"
                    >
                      <FaDownload /> View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">No certificates unlocked yet. Score 75% or higher on a course assessment quiz.</p>
            )}
          </div>

          {/* Badges Grid shelf */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FaAward className="text-indigo-500 text-xl" />
              <h3 className="font-extrabold text-slate-855 dark:text-white text-base">Earned Badges</h3>
            </div>

            {user.badges && user.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {user.badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5"
                  >
                    <span>🎖️</span>
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">Complete quizzes to unlock achievements and badges.</p>
            )}
          </div>
        </div>

        {/* Right Grid: Quiz History details */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
            <FaHistory className="text-indigo-500 text-xl" />
            <h3 className="font-extrabold text-slate-855 dark:text-white text-base">Quiz Assessment History</h3>
          </div>

          {quizHistory.length > 0 ? (
            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {quizHistory.map((hist, index) => (
                <div
                  key={hist._id || index}
                  className="p-3.5 rounded-xl border border-slate-150 dark:border-slate-850 flex justify-between items-center text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{hist.courseName}</p>
                    <p className="text-[10px] text-slate-400">
                      Time Taken: {Math.floor(hist.timeTaken / 60)}m {hist.timeTaken % 60}s | Date: {new Date(hist.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <p className="font-extrabold text-slate-850 dark:text-slate-205">{hist.percentage}%</p>
                    <span
                      className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        hist.passStatus
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
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
            <p className="text-slate-400 text-xs italic">No quiz attempts recorded yet.</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default Profile;
export { Profile };
