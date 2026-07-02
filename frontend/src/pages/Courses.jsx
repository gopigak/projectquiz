import React, { useEffect, useState } from 'react';
import { useCourse } from '../hooks/useCourse';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';
import { FaSearch, FaFilter, FaRedoAlt } from 'react-icons/fa';

const Courses = () => {
  const { courses, fetchCourses, quizHistory, fetchQuizHistory, loading } = useCourse();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    fetchCourses();
    fetchQuizHistory();
  }, []);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('All');
  };

  // Calculate course completion progress based on quiz history
  // If a course is passed in quiz history (marks > 50%), progress is 100%.
  // If it was attempted but not passed, progress is 50%.
  // Otherwise, progress is 0%.
  const getCourseProgress = (courseId) => {
    const attempts = quizHistory.filter((h) => h.courseId === courseId);
    if (attempts.length === 0) return 0;
    const passed = attempts.some((h) => h.passStatus);
    return passed ? 100 : 50;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Programming Courses
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Learn syntax, read structured code blocks, and test yourself on 19 expert certification tracks.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch className="text-xs" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses (e.g. React, SQL)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden focus:border-indigo-500 dark:text-white transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex w-full md:w-auto items-center gap-3 justify-end">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-slate-400 text-xs" />
            <div className="relative flex items-center shrink-0">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="appearance-none pl-3 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer min-w-[150px]"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <div className="absolute right-3.5 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            title="Reset Filters"
          >
            <FaRedoAlt className="text-[10px]" /> <span className="hidden sm:inline font-bold">Reset</span>
          </button>
        </div>

      </div>

      {/* Grid of Course Cards */}
      {loading ? (
        <Loader />
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id}>
              <CourseCard 
                course={course} 
                progress={getCourseProgress(course.courseId)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm font-semibold italic">No courses match your query criteria.</p>
          <button 
            onClick={handleClearFilters} 
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default Courses;
export { Courses };
