import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  FaSun, 
  FaMoon, 
  FaFire, 
  FaTrophy, 
  FaUser, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt, 
  FaShieldAlt 
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
      isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300'
    }`;

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-colors">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            EduQuiz
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold">
            PRO
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
          <NavLink to="/leaderboard" className={navLinkClass}>Leaderboard</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass + " flex items-center gap-1.5 text-rose-600 dark:text-rose-400"}>
              <FaShieldAlt className="text-xs" /> Admin
            </NavLink>
          )}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              {/* Streak Tracker */}
              <div 
                className="flex items-center px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-bold"
                title="Daily Learning Streak"
              >
                <FaFire className="mr-1 animate-pulse" />
                <span>{user.streakCount || 0} Days</span>
              </div>

              {/* XP display */}
              <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 select-none">
                ⭐ {user.xpPoints || 0} XP
              </div>

              {/* Coins display */}
              <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 select-none">
                🪙 {user.coins || 0} Coins
              </div>

              {/* Profile / Dashboard button */}
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-500/20"
              >
                <FaUser className="text-xs" /> Dashboard
              </Link>

              {/* Profile Link Icon */}
              <Link 
                to="/profile" 
                className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:ring-2 hover:ring-indigo-500 transition-all font-semibold"
                title="View Profile"
              >
                {user.name.charAt(0).toUpperCase()}
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 transition-all"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-indigo-500/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
          >
            {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon />}
          </button>

          {/* Toggle Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 glass-panel border-b border-slate-200 dark:border-slate-800 py-4 px-6 md:hidden flex flex-col space-y-4 animate-fade-in transition-all">
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Home</NavLink>
          <NavLink to="/courses" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Courses</NavLink>
          <NavLink to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Leaderboard</NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Contact</NavLink>

          {user?.role === 'admin' && (
            <NavLink 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)} 
              className={navLinkClass + " flex items-center gap-1.5 text-rose-500"}
            >
              <FaShieldAlt className="text-xs" /> Admin Panel
            </NavLink>
          )}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-850 flex flex-col space-y-3">
            {user ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-orange-600 dark:text-orange-400 font-bold text-sm">
                    <FaFire className="mr-1" />
                    <span>{user.streakCount || 0} Streak Days</span>
                  </div>
                  <div className="text-xs font-bold text-indigo-500">
                    ⭐ {user.xpPoints || 0} XP
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-lg transition-all"
                >
                  Dashboard
                </Link>
                
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 py-2.5 rounded-lg transition-all"
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 py-2.5 rounded-lg transition-all"
                >
                  <FaSignOutAlt /> Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 py-2.5 rounded-lg transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
export { Navbar };
