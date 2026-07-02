import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaRegCircle, FaClock, FaCheck, FaTimes, FaInbox } from 'react-icons/fa';

const ResultCard = ({ result }) => {
  const {
    studentName,
    courseName,
    marks,
    totalQuestions,
    percentage,
    correctAnswers,
    wrongAnswers,
    skippedQuestions,
    timeTaken,
    performanceLevel,
    passStatus,
  } = result;

  // SVG Circular progress dimensions
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-md">
      
      {/* Top Banner Status */}
      <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-850 space-y-2">
        <h3 className="text-2xl font-black tracking-tight text-slate-855 dark:text-white">
          Quiz Scorecard
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Student: <span className="font-bold text-slate-700 dark:text-slate-300">{studentName}</span> | Subject: <span className="font-bold text-slate-750 dark:text-slate-350">{courseName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 items-center">
        {/* Left Side: Circular SVG Chart */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center">
            {/* SVG Ring */}
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke={window.document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9'}
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={passStatus ? '#10b981' : '#ef4444'}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                {percentage}%
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</p>
            </div>
          </div>

          <div className="text-center space-y-1">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                passStatus
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
              }`}
            >
              {passStatus ? 'PASSED TEST' : 'FAILED TEST'}
            </span>
            <p className="text-xs text-slate-400">
              Grade: <span className="font-bold text-slate-700 dark:text-slate-350">{performanceLevel}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Tabular stats */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <FaCheck className="text-emerald-500" /> Correct Answers
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {correctAnswers} / {totalQuestions}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <FaTimes className="text-rose-500" /> Incorrect Answers
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {wrongAnswers}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <FaInbox className="text-slate-450" /> Skipped Questions
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {skippedQuestions}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <FaClock className="text-indigo-500" /> Time Elapsed
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {formatDuration(timeTaken)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResultCard;
export { ResultCard };
