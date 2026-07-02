import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
      
      {/* Icon alert */}
      <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center text-2xl border border-rose-150 animate-pulse">
        <FaExclamationTriangle />
      </div>

      <div className="space-y-2">
        <h2 className="text-7xl font-black bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-tighter">
          404 Error
        </h2>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          Syllabus Node Missing
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          The route you navigated to does not exist. Please check the URL path or return to safety.
        </p>
      </div>

      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
      >
        <FaHome /> Return Home
      </Link>

    </div>
  );
};

export default NotFound;
export { NotFound };
