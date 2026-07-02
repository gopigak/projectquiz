import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import { useCourse } from '../hooks/useCourse';
import { FaLaptopCode, FaCheckDouble, FaUserCheck, FaRoute, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
  const { courses, fetchCourses } = useCourse();

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter 4 main beginner/intermediate courses to display as features
  const featuredCourses = courses.length > 0 
    ? courses.slice(0, 4) 
    : [
        { _id: '1', name: 'HTML', courseId: 'html', description: 'Learn HyperText Markup Language, the standard markup language for creating web pages and structure.', difficulty: 'Beginner', estimatedTime: '2 hours', chaptersCount: 1, questionsCount: 3 },
        { _id: '2', name: 'CSS', courseId: 'css', description: 'Learn Cascading Style Sheets to control the layout, presentation, and responsiveness of your web documents.', difficulty: 'Beginner', estimatedTime: '3 hours', chaptersCount: 1, questionsCount: 3 },
        { _id: '3', name: 'JavaScript', courseId: 'javascript', description: 'Learn JavaScript, the programming language of the Web, covering modern ES6+ features and async operations.', difficulty: 'Intermediate', estimatedTime: '4 hours', chaptersCount: 1, questionsCount: 3 },
        { _id: '4', name: 'React.js', courseId: 'react', description: 'Build interactive user interfaces with React, virtual DOM, components, props, hooks, and context.', difficulty: 'Intermediate', estimatedTime: '5 hours', chaptersCount: 1, questionsCount: 3 }
      ];

  const features = [
    {
      icon: <FaLaptopCode className="text-2xl text-indigo-500" />,
      title: "Programming Courses",
      desc: "Comprehensive modules covering Web Dev, OOP, DSA, and databases with syntaxes and copyable codes."
    },
    {
      icon: <FaCheckDouble className="text-2xl text-violet-500" />,
      title: "Interactive Mock Tests",
      desc: "Timed certification exams with multiple choice palettes, auto-saving, and automated evaluations."
    },
    {
      icon: <FaRoute className="text-2xl text-pink-500" />,
      title: "Interview Questions",
      desc: "Every learning note integrates solved corporate placement questions, tips, and summaries."
    },
    {
      icon: <FaUserCheck className="text-2xl text-emerald-500" />,
      title: "Gamified Tracking",
      desc: "Earn XP points on correct answers, track daily active streaks, unlock certificates, and earn badges."
    }
  ];

  return (
    <div className="space-y-20">
      {/* Animated Hero Header */}
      <Hero />

      {/* Grid Platform Features */}
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Designed for Modern Tech Learning
          </h2>
          <p className="text-slate-500 dark:text-slate-405 max-w-lg mx-auto text-sm">
            Everything you need to master code syntax, test your comprehension, and prepare for recruiting boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 flex items-center justify-center">
                {feat.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">{feat.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Courses slider/grid */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Start Your Coding Journey
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Select a learning track, read explanations, and attempt the certification mock test.
            </p>
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all shrink-0 cursor-pointer"
          >
            Explore all 19 courses <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <div key={course._id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>

      {/* Call to action card banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center text-white bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-snug">
            Ready to Verify Your Knowledge & Share Certificates?
          </h3>
          <p className="text-sm text-indigo-100 max-w-md mx-auto leading-relaxed">
            Create a student profile to track streaks, save bookmarks, compete on leaderboards, and print credentials.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-xl hover:scale-[1.03] active:scale-95 transition-all shadow-md text-sm"
            >
              Sign Up Now For Free
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.04] pointer-events-none"></div>
      </div>

    </div>
  );
};

export default Home;
export { Home };
