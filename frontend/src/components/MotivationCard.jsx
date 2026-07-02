import React, { useMemo } from 'react';
import { FaQuoteLeft, FaFire, FaInfoCircle } from 'react-icons/fa';

const MotivationCard = ({ percentage }) => {
  const motivationalQuote = useMemo(() => {
    if (percentage >= 90) {
      return {
        title: "Interview Ready! 🚀",
        text: "Outstanding! Keep up the excellent work. You're interview-ready!",
        bg: "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-500 text-emerald-800 dark:text-emerald-300",
      };
    } else if (percentage >= 75) {
      return {
        title: "Superb Effort! 🔥",
        text: "Excellent performance! You're getting stronger every day.",
        bg: "bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-500 text-indigo-800 dark:text-indigo-300",
      };
    } else if (percentage >= 50) {
      return {
        title: "Keep Going! 👍",
        text: "Good job! Keep practicing to improve further.",
        bg: "bg-amber-50/50 dark:bg-amber-950/10 border-amber-500 text-amber-800 dark:text-amber-300",
      };
    } else {
      return {
        title: "Never Give Up! 💪",
        text: "Don't give up. Every expert was once a beginner. Learn, practice, and try again.",
        bg: "bg-rose-50/50 dark:bg-rose-950/10 border-rose-500 text-rose-800 dark:text-rose-300",
      };
    }
  }, [percentage]);

  const inspirationalQuotes = [
    "The only way to learn a new programming language is by writing programs in it. — Dennis Ritchie",
    "Talk is cheap. Show me the code. — Linus Torvalds",
    "Programs must be written for people to read, and only incidentally for machines to execute. — Abelson & Sussman",
    "First, solve the problem. Then, write the code. — John Johnson",
    "Make it work, make it right, make it fast. — Kent Beck",
    "Computers are good at following instructions, but not at reading your mind. — Donald Knuth",
    "In order to be irreplaceable, one must always be different. — Coco Chanel"
  ];

  const randomQuote = useMemo(() => {
    const idx = Math.floor(Math.random() * inspirationalQuotes.length);
    return inspirationalQuotes[idx];
  }, []);

  return (
    <div className="space-y-4">
      {/* Target score feedback */}
      <div className={`p-5 rounded-2xl border-l-4 border ${motivationalQuote.bg} shadow-xs`}>
        <div className="flex items-center gap-2 mb-1.5">
          <FaFire className="animate-pulse" />
          <h4 className="font-extrabold text-sm uppercase tracking-wider">{motivationalQuote.title}</h4>
        </div>
        <p className="text-sm font-medium leading-relaxed italic">{motivationalQuote.text}</p>
      </div>

      {/* General random inspiration coding quote */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 relative">
        <FaQuoteLeft className="absolute top-4 left-4 text-slate-200 dark:text-slate-800 text-3xl pointer-events-none" />
        <div className="relative pl-6 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <FaInfoCircle /> Quote of the Day
          </p>
          <p className="text-sm font-serif italic text-slate-650 dark:text-slate-300 leading-relaxed pt-1">
            {randomQuote}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotivationCard;
export { MotivationCard };
