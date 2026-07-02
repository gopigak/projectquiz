import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCode, FaCheckCircle, FaUsers } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 flex flex-col items-center justify-center text-center">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Banner Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-100 dark:border-indigo-900/30"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          <span>Interview Preparation Engine & Interactive Notes</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white"
        >
          Master{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Programming Skills
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Learn core structures, read expert-level tech notes, test yourself with real exam quizzes, and get interview ready today.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link
            to="/courses"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 group"
          >
            Get Started <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/courses"
            className="w-full sm:w-auto px-8 py-4 glass-panel text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-800"
          >
            Browse Courses
          </Link>
        </motion.div>

        {/* Highlights Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto"
        >
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-xs">
            <FaCode className="text-2xl text-indigo-500 mb-2" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-250">19+ Programming Paths</span>
            <span className="text-xs text-slate-400">Notes & interactive tests</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-xs">
            <FaCheckCircle className="text-2xl text-violet-500 mb-2" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-250">Interview Ready</span>
            <span className="text-xs text-slate-400">Real questions & code answers</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-xs col-span-2 md:col-span-1">
            <FaUsers className="text-2xl text-pink-500 mb-2" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-250">Global Leaderboard</span>
            <span className="text-xs text-slate-400">Compete & earn badges</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
export { Hero };
