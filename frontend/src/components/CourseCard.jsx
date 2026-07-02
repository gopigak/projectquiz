import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaBook, FaQuestionCircle, FaStar } from 'react-icons/fa';

// Maps course images/IDs to nice CSS gradient styles representing tech logos
const gradientMap = {
  html: 'from-orange-500 to-amber-600',
  css: 'from-blue-500 to-indigo-600',
  javascript: 'from-yellow-400 to-amber-500',
  react: 'from-cyan-400 to-blue-600',
  node: 'from-green-500 to-emerald-700',
  express: 'from-slate-600 to-slate-800',
  mongodb: 'from-emerald-600 to-green-700',
  mern: 'from-indigo-600 via-purple-600 to-pink-600',
  python: 'from-blue-500 to-yellow-500',
  java: 'from-orange-600 to-red-700',
  c: 'from-indigo-400 to-blue-600',
  cpp: 'from-blue-600 to-indigo-700',
  sql: 'from-sky-500 to-blue-700',
  dsa: 'from-rose-500 to-pink-600',
  algorithms: 'from-violet-500 to-purple-600',
  'data-analyst': 'from-teal-500 to-emerald-600',
  git: 'from-orange-600 to-red-650',
  github: 'from-slate-700 to-slate-900',
  aptitude: 'from-fuchsia-500 to-pink-600',
};

const CourseCard = ({ course, progress = 0 }) => {
  const { name, courseId, description, difficulty, estimatedTime, chaptersCount, questionsCount } = course;
  const gradient = gradientMap[courseId] || 'from-indigo-500 to-purple-600';

  const diffColors = {
    Beginner: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
    Intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
    Advanced: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full border border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-xl dark:shadow-black/25 transition-all"
    >
      {/* Top Graphic Header */}
      <div className={`h-28 bg-gradient-to-tr ${gradient} p-4 flex items-center justify-between text-white relative`}>
        <div className="space-y-1">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs`}>
            {difficulty}
          </span>
          <h3 className="text-xl font-bold tracking-tight">{name}</h3>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-extrabold text-2xl">
          {name.slice(0, 2).toUpperCase()}
        </div>
        
        {/* Subtle grid pattern overlays */}
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"></div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {description}
          </p>

          {/* Key Metrics details */}
          <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <FaBook className="text-indigo-500 shrink-0" />
              <span>{chaptersCount} Chs</span>
            </div>
            <div className="flex items-center gap-1">
              <FaQuestionCircle className="text-violet-500 shrink-0" />
              <span>{questionsCount} Qs</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="text-pink-500 shrink-0" />
              <span>{estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar (if learning started) */}
        <div className="mt-5 space-y-4">
          {progress > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                <span>Course Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Link Button */}
          <Link
            to={`/courses/${courseId}`}
            className="block w-full text-center text-sm font-semibold py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-700 hover:text-white dark:text-slate-200 transition-all font-semibold"
          >
            {progress === 100 ? 'View Certificate' : progress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
export { CourseCard };
