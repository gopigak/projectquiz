import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaClock, FaClipboardList, FaFileSignature, FaPlay, FaLock, FaLockOpen } from 'react-icons/fa';

const QuizCard = ({ course, isUnlocked = false }) => {
  const navigate = useNavigate();
  const { name, courseId, chapters = [], estimatedTime } = course;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-panel rounded-2xl p-6 border text-slate-800 dark:text-slate-100 flex flex-col justify-between space-y-6 ${
        isUnlocked 
          ? 'border-indigo-500 shadow-lg shadow-indigo-500/5' 
          : 'border-slate-200 dark:border-slate-800 opacity-80'
      }`}
    >
      <div className="space-y-4">
        {/* Header Badge */}
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${
          isUnlocked 
            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400' 
            : 'bg-slate-100 dark:bg-slate-850 text-slate-400 dark:text-slate-500'
        }`}>
          {isUnlocked ? <FaLockOpen className="text-[10px]" /> : <FaLock className="text-[9px]" />}
          <span>{isUnlocked ? 'Certificate Test Unlocked' : 'Certificate Test Locked'}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight">
          {name} Certificate Test
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {isUnlocked 
            ? `Demonstrate your mastery over ${name}. Pass this test to unlock and download your professional digital certificate.`
            : 'Complete all chapters and topics to unlock the Certificate Test.'
          }
        </p>

        {/* Info Grid details */}
        <div className="grid grid-cols-2 gap-4 py-2 text-xs">
          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80">
            <FaClipboardList className="text-indigo-500 text-base" />
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-350">25 Questions</p>
              <p className="text-[10px] text-slate-400">Multiple choice format</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80">
            <FaClock className="text-violet-500 text-base" />
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-350">20 Mins Limit</p>
              <p className="text-[10px] text-slate-400">Auto-submits on timeout</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 col-span-2">
            <FaFileSignature className="text-pink-500 text-base" />
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-350">Passing Criteria</p>
              <p className="text-[10px] text-slate-400">Score 70% or higher to unlock Certificate.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Launch Exam Action */}
      <button
        disabled={!isUnlocked}
        onClick={() => navigate(`/courses/${courseId}/cert-test`)}
        className={`w-full py-3.5 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm select-none ${
          isUnlocked
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 hover:shadow-indigo-500/20 cursor-pointer group'
            : 'bg-slate-100 dark:bg-slate-850 text-slate-400 border border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-50'
        }`}
      >
        {isUnlocked ? (
          <>
            <FaPlay className="text-xs group-hover:scale-110 transition-transform" />
            <span>Start Certificate Test</span>
          </>
        ) : (
          <>
            <FaLock className="text-xs" />
            <span>Test Locked 🔒</span>
          </>
        )}
      </button>
    </motion.div>
  );
};

export default QuizCard;
export { QuizCard };
