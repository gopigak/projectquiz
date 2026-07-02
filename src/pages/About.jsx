import React from 'react';
import { FaBookmark, FaLaptopCode, FaCheckDouble, FaAward } from 'react-icons/fa';

const About = () => {
  return (
    <div className="space-y-12 max-w-3xl mx-auto py-6">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          About EduQuiz Platform
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Providing high-performance mock assessment testing for software engineers.
        </p>
      </div>

      {/* Main Content Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-md text-sm leading-relaxed text-slate-600 dark:text-slate-350">
        
        <p>
          EduQuiz is a modern, responsive full-stack MERN application engineered to bridge the gap between reading reference materials and evaluating coding competency. Drawing inspiration from top portals like GeeksforGeeks, W3Schools, and Udemy, it acts as a comprehensive portal to learn programming structures and test key language syntaxes.
        </p>

        <h3 className="text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">How It Works</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border border-indigo-150 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">Study Chapters</p>
            <p className="text-[11px] text-slate-400">Review syntax logs, copy code examples, inspect console outputs, and read resolved interview questions.</p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-500 border border-violet-150 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">Take Assessment</p>
            <p className="text-[11px] text-slate-400">Attempt timed certification tests inside a streamlined exam layout with automated palettes and timers.</p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-500 border border-pink-150 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">Print Credentials</p>
            <p className="text-[11px] text-slate-400">Score 75% or higher to unlock an official completion certificate downloadable directly as a PDF.</p>
          </div>
        </div>

        <h3 className="text-base font-extrabold text-slate-850 dark:text-white uppercase tracking-wider pt-2">Core Tech Stack</h3>
        <p>
          EduQuiz is built using Node.js, Express, MongoDB, and Mongoose on the backend, alongside React (Vite integration), Tailwind CSS v4, Context API, and Framer Motion on the frontend. Scorecard reports are dispatched automatically to registration email addresses using Nodemailer SMTP services.
        </p>

      </div>

    </div>
  );
};

export default About;
export { About };
