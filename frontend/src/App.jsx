import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { useAuth } from './hooks/useAuth';
import { useCourse } from './hooks/useCourse';
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
            <AppRoutes />
          </Router>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
