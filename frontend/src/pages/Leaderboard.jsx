import React, { useEffect, useState } from 'react';
import { useCourse } from '../hooks/useCourse';
import Loader from '../components/Loader';
import { FaTrophy, FaMedal, FaFilter } from 'react-icons/fa';

const Leaderboard = () => {
  const { leaderboard, fetchOverallLeaderboard, fetchCourseLeaderboard, courses, fetchCourses, loading } = useCourse();
  const [selectedCourse, setSelectedCourse] = useState('overall');

  useEffect(() => {
    fetchCourses();
    handleFilterChange('overall');
  }, []);

  const handleFilterChange = (value) => {
    setSelectedCourse(value);
    if (value === 'overall') {
      fetchOverallLeaderboard();
    } else {
      fetchCourseLeaderboard(value);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500 text-lg animate-bounce" title="Gold Trophy" />;
    if (rank === 2) return <FaMedal className="text-slate-350 text-lg" title="Silver Medal" />;
    if (rank === 3) return <FaMedal className="text-amber-600 text-lg" title="Bronze Medal" />;
    return <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 flex items-center justify-center">{rank}</span>;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FaTrophy className="text-yellow-500" /> Platform Leaderboards
          </h2>
          <p className="text-sm text-slate-550 dark:text-slate-400">
            Compare rankings globally or filter scoreboards by course subject.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative flex items-center shrink-0">
          <select
            value={selectedCourse}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="appearance-none pl-3 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer min-w-[200px]"
          >
            <option value="overall">🏆 Global XP Leaderboard</option>
            {Array.isArray(courses) && courses.map((course) => (
              <option key={course._id} value={course.courseId}>
                📚 {course.name} Assessment
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-slate-400 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* Leaderboard Rankings List */}
      {loading ? (
        <Loader />
      ) : Array.isArray(leaderboard) && leaderboard.length > 0 ? (
        <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-850">
                  <th className="p-4 w-20 text-center">Rank</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">
                    {selectedCourse === 'overall' ? 'Achievements' : 'Submitted Date'}
                  </th>
                  <th className="p-4 text-right">
                    {selectedCourse === 'overall' ? 'Experience Score' : 'Certification Score'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-250">
                {leaderboard.map((item, idx) => {
                  const rank = idx + 1;
                  const isOverall = selectedCourse === 'overall';

                  return (
                    <tr 
                      key={item._id || idx}
                      className={`hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors ${
                        rank <= 3 ? 'bg-indigo-50/5 dark:bg-indigo-950/5 font-semibold' : ''
                      }`}
                    >
                      <td className="p-4 flex items-center justify-center">
                        {getRankBadge(rank)}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-850 dark:text-slate-150">
                          {isOverall ? item.name : item.studentName}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        {isOverall ? (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold text-slate-500 dark:text-slate-400">
                            {item.badges?.length || 0} Badges
                          </span>
                        ) : (
                          new Date(item.createdAt).toLocaleDateString()
                        )}
                      </td>
                      <td className="p-4 text-right font-black tracking-tight text-slate-900 dark:text-white">
                        {isOverall ? `${item.xpPoints} XP` : `${item.percentage}% (${item.marks}/${item.totalQuestions})`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm font-semibold italic">No scores submitted yet for this scoreboard category.</p>
        </div>
      )}

    </div>
  );
};

export default Leaderboard;
export { Leaderboard };
