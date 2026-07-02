import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaDiscord, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand and Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              EduQuiz Platform
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Master programming skills, clear technical mock tests, and get interview-ready with our premium learning modules.
            </p>
            <div className="flex space-x-4 text-slate-400 dark:text-slate-500">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors"><FaGithub size={18} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors"><FaTwitter size={18} /></a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors"><FaDiscord size={18} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors"><FaLinkedin size={18} /></a>
            </div>
          </div>

          {/* Features Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-350">
              <li><Link to="/courses" className="hover:text-indigo-500 transition-colors">Programming Courses</Link></li>
              <li><Link to="/courses" className="hover:text-indigo-500 transition-colors">Mock Tests</Link></li>
              <li><Link to="/courses" className="hover:text-indigo-500 transition-colors">Interview Questions</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-500 transition-colors">Progress Tracking</Link></li>
            </ul>
          </div>

          {/* Popular Courses Column */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular Subjects</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-350">
              <li><Link to="/courses/react" className="hover:text-indigo-500 transition-colors">React.js Development</Link></li>
              <li><Link to="/courses/javascript" className="hover:text-indigo-500 transition-colors">Advanced JavaScript</Link></li>
              <li><Link to="/courses/dsa" className="hover:text-indigo-500 transition-colors">Data Structures & Algos</Link></li>
              <li><Link to="/courses/mern" className="hover:text-indigo-500 transition-colors">Full-Stack MERN Development</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-350">
              <li><Link to="/about" className="hover:text-indigo-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-500 transition-colors">Contact Support</Link></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} EduQuiz. Designed for high-performance developer learning. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };
