import React from 'react';

const ProgressBar = ({ current, total, label = "Progress", showText = true }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full space-y-1.5">
      {showText && (
        <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>{label}</span>
          <span>{percentage}% ({current}/{total})</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-150 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-350"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
export { ProgressBar };
