import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { useAuth } from './hooks/useAuth';
import { useCourse } from './hooks/useCourse';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

const LearningTimeTracker = () => {
  const { user } = useAuth();
  const { syncLearningTime } = useCourse();

  useEffect(() => {
    if (!user) return;

    // Send a 1-minute increment heartbeat every 60 seconds of learning activity
    const interval = setInterval(() => {
      syncLearningTime(1);
    }, 60000);

    return () => clearInterval(interval);
  }, [user, syncLearningTime]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <Router>
            <LearningTimeTracker />
            <div className="flex flex-col min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100">
              <Toaster 
                position="top-right" 
                toastOptions={{ 
                  duration: 4000,
                  className: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xl'
                }} 
              />
              <Navbar />
              <main className="flex-grow pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto w-full box-border">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
