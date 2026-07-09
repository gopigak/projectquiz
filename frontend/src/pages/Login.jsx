import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return toast.error('Please fill in all credentials.');
    }

    const res = await login(cleanEmail, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      return toast.error('Please input your registered email address first.');
    }
    toast.success(`Password recovery link dispatched to ${email}! (Mocked) ✉️`);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="glass-panel rounded-2xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to resume learning and earn badges
          </p>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaEnvelope className="text-sm" />
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-sm focus:outline-hidden focus:border-indigo-500 dark:text-white focus:ring-2 focus:ring-indigo-500/15 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaLock className="text-sm" />
              </span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-sm focus:outline-hidden focus:border-indigo-500 dark:text-white focus:ring-2 focus:ring-indigo-500/15 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <FaSignInAlt /> Log In
              </>
            )}
          </button>
        </form>

        {/* Redirect toggle Link */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
export { Login };
