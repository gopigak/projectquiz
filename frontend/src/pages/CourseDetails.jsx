import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import QuizCard from '../components/QuizCard';
import { FaArrowLeft, FaCheckCircle, FaLock, FaBookOpen } from 'react-icons/fa';

const CourseDetails = () => {
  const { id } = useParams();
  const { activeCourse, fetchCourseDetails, loading } = useCourse();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseDetails(id);
  }, [id]);

  if (loading || !activeCourse || activeCourse.courseId !== id) {
    return <Loader />;
  }

  const {
    name,
    description,
    difficulty,
    estimatedTime,
    topicsCovered = [],
    prerequisites = [],
    outcomes = [],
    chaptersCount,
  } = activeCourse;

  // Find the first incomplete chapter index to direct "Resume Learning"
  let resumeIndex = 0;
  for (let i = 0; i < topicsCovered.length; i++) {
    const token = `${id}_${i}`;
    if (!(user?.completedChapters || []).includes(token)) {
      resumeIndex = i;
      break;
    }
  }

  // Final exam unlock status (all chapters must be completed)
  const isExamUnlocked = topicsCovered.every((_, idx) =>
    (user?.completedChapters || []).includes(`${id}_${idx}`)
  );

  return (
    <div className="space-y-6">
      
      {/* Return Back Link */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <FaArrowLeft className="text-[10px]" /> Back to Courses List
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Course Syllabus Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-md">
            
            {/* Header info */}
            <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-850">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                {difficulty} Course Track
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-905 dark:text-white">
                {name} Syllabus Path
              </h2>
              <p className="text-xs font-medium text-slate-400">
                Estimated Duration: {estimatedTime} | Total Chapters: {chaptersCount}
              </p>
              <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed pt-1">
                {description}
              </p>
            </div>

            {/* Overall Course Progress Bar */}
            {(() => {
              const completedCount = topicsCovered.filter((_, idx) =>
                (user?.completedChapters || []).includes(`${id}_${idx}`)
              ).length;
              const progressPercent = topicsCovered.length > 0 ? Math.round((completedCount / topicsCovered.length) * 100) : 0;
              return (
                <div className="p-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500">Course Syllabus Progress</span>
                    <span className="text-indigo-650 dark:text-indigo-400 font-extrabold">{progressPercent}% Completed ({completedCount}/{topicsCovered.length} Chapters)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-650 rounded-full transition-all duration-550 ease-out" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Topics covered checklist */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-widest">Chapters & syllabus</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topicsCovered.map((topic, idx) => {
                  const isUnlocked = idx === 0 || (user?.completedChapters || []).includes(`${id}_${idx - 1}`);
                  const isCompleted = (user?.completedChapters || []).includes(`${id}_${idx}`);
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (isUnlocked) navigate(`/courses/${id}/notes`, { state: { chapterIndex: idx } });
                      }}
                      className={`group p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 relative overflow-hidden select-none ${
                        isCompleted
                          ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/5 dark:bg-emerald-950/10 shadow-xs cursor-pointer hover:border-emerald-450 hover:-translate-y-0.5'
                          : isUnlocked
                            ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:-translate-y-1 hover:shadow-md cursor-pointer'
                            : 'border-slate-100 dark:border-slate-950 bg-slate-100/30 dark:bg-slate-900/20 text-slate-350 dark:text-slate-650 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Top Row: Chapter Badge & Lock State */}
                      <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-150 dark:border-slate-850">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450'
                            : isUnlocked
                              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-405 dark:text-slate-500'
                        }`}>
                          Chapter {String(idx + 1).padStart(2, '0')}
                        </span>
                        
                        {isCompleted ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <FaCheckCircle className="text-xs" /> Completed
                          </span>
                        ) : !isUnlocked ? (
                          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <FaLock className="text-[9px]" /> Locked
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400 flex items-center gap-1 group-hover:animate-pulse">
                            <FaBookOpen className="text-xs" /> Unlocked
                          </span>
                        )}
                      </div>

                      {/* Content Row: Icon & Title */}
                      <div className="flex items-start gap-3.5 py-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-100/60 dark:bg-emerald-950/30 text-emerald-650'
                            : isUnlocked
                              ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400'
                              : 'bg-slate-200/50 dark:bg-slate-800/40 text-slate-400'
                        }`}>
                          <FaBookOpen className="text-base" />
                        </div>
                        <div className="space-y-1">
                          <h4 className={`text-sm font-extrabold leading-snug ${
                            isCompleted ? 'text-emerald-900 dark:text-emerald-200' : isUnlocked ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-600'
                          }`}>
                            {topic}
                          </h4>
                          <p className="text-[10px] text-slate-400">Estimated read time: 10-15 mins</p>
                        </div>
                      </div>

                      {/* Footer hover hint */}
                      {isUnlocked && (
                        <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          {isCompleted ? 'Review Chapter Note \u2192' : 'Open Chapter Note \u2192'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-widest">Prerequisites</h3>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-350 space-y-1 pl-1">
                {prerequisites.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-widest">Learning Outcomes</h3>
              <div className="space-y-2">
                {outcomes.map((out, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-650 dark:text-slate-300">
                    <FaCheckCircle className="text-indigo-500 shrink-0 mt-0.5 text-sm" />
                    <span className="leading-normal">{out}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons to launch Notes */}
            {chaptersCount > 0 && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-850 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    navigate(`/courses/${id}/notes`, { state: { chapterIndex: resumeIndex } });
                  }}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md hover:shadow-indigo-500/20 cursor-pointer"
                >
                  {resumeIndex > 0 ? 'Resume Learning Track' : 'Start Reading Notes'}
                </button>

                <button
                  disabled={!isExamUnlocked}
                  onClick={() => {
                    if (isExamUnlocked) navigate(`/courses/${id}/cert-test`);
                  }}
                  className={`px-6 py-3.5 font-extrabold rounded-xl text-xs transition-all shadow-md cursor-pointer ${
                    isExamUnlocked
                      ? 'bg-gradient-to-r from-rose-500 to-indigo-500 hover:opacity-90 text-white'
                      : 'bg-slate-100 dark:bg-slate-850 text-slate-400 border border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-50'
                  }`}
                  title={isExamUnlocked ? 'Start Certification Exam' : 'Complete all chapter study modules to unlock exam'}
                >
                  {isExamUnlocked ? 'Start Final Exam 🎓' : 'Final Exam Locked 🔒'}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Quiz Assessment parameters */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <QuizCard course={activeCourse} isUnlocked={isExamUnlocked} />
        </div>

      </div>

    </div>
  );
};

export default CourseDetails;
export { CourseDetails };
