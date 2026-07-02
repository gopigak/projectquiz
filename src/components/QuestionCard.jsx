import React from 'react';
import { FaBookmark, FaRegBookmark, FaCheck } from 'react-icons/fa';
import { useCourse } from '../hooks/useCourse';

const QuestionCard = ({
  question,
  questionNumber,
  selectedOption,
  onSelectOption
}) => {
  const { bookmarks, toggleBookmark } = useCourse();
  const { questionText, options, difficulty } = question;

  const isBookmarked = bookmarks.some((q) => q.questionText === questionText);

  const diffBadgeColors = {
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
    Hard: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-md relative">
      
      {/* Top Header Indicators */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
            Question {questionNumber}
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${diffBadgeColors[difficulty] || 'bg-slate-100 text-slate-800'}`}>
            {difficulty}
          </span>
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={() => toggleBookmark(question)}
          className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-all cursor-pointer"
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
        >
          {isBookmarked ? (
            <FaBookmark className="text-indigo-500" />
          ) : (
            <FaRegBookmark className="text-slate-400" />
          )}
        </button>
      </div>

      {/* Question Text */}
      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-8">
        {questionText}
      </h3>

      {/* Multiple Choice Options List */}
      <div className="space-y-3.5">
        {options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <button
              key={idx}
              onClick={() => onSelectOption(idx)}
              className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all group cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 font-semibold ring-2 ring-indigo-500/25'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-750 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                {/* Option Identifier Badge (A, B, C, D) */}
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-505 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-slate-700 group-hover:text-indigo-600'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm md:text-base leading-snug">{opt}</span>
              </div>

              {isSelected && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white">
                  <FaCheck />
                </span>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default QuestionCard;
export { QuestionCard };
