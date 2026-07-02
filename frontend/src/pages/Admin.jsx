import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';
import Loader from '../components/Loader';
import AdminSidebar from '../components/AdminSidebar';
import { 
  FaShieldAlt, 
  FaUsers, 
  FaBook, 
  FaQuestionCircle, 
  FaClipboardList, 
  FaBullhorn, 
  FaPlus, 
  FaTrashAlt, 
  FaCheckCircle, 
  FaChartLine,
  FaFileExcel,
  FaFilePdf,
  FaSearch,
  FaUserSlash,
  FaUserCheck,
  FaReply,
  FaCheck,
  FaTimes,
  FaCog,
  FaEnvelope,
  FaAward,
  FaTrophy,
  FaPaperPlane,
  FaUserGraduate,
  FaPoll,
  FaComments
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Admin = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // States for lists
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [courseStats, setCourseStats] = useState([]);

  // Filter States
  const [studentSearch, setStudentSearch] = useState('');
  const [resultSearch, setResultSearch] = useState('');

  // Course configuration parameters
  const [settings, setSettings] = useState({
    passScore: 50,
    certScore: 80,
    allowSMTPFallback: true,
    platformLockdown: false
  });

  // Forms states
  const [courseForm, setCourseForm] = useState({ name: '', courseId: '', description: '', difficulty: 'Beginner', estimatedTime: '', image: '', isPublished: true });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [feedbackReply, setFeedbackReply] = useState({ id: '', text: '' });

  // Notes form (W3Schools detailed style)
  const [noteForm, setNoteForm] = useState({
    title: '',
    definition: '',
    explanation: '',
    syntax: '',
    codeExample: '',
    output: '',
    realWorldExample: '',
    importantPoints: '',
    tips: '',
    summary: ''
  });

  // Question form (MCQ / True-False / Code Output)
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    optionsStr: '',
    correctAnswer: 0,
    explanation: '',
    difficulty: 'Medium',
    type: 'MCQ',
    tag: 'Practice'
  });

  useEffect(() => {
    fetchAdminWorkspace();
  }, []);

  const fetchAdminWorkspace = async () => {
    setLoading(true);
    try {
      const statsRes = await API.get('/admin/stats');
      setStats(statsRes.data.stats);
      setRecentResults(statsRes.data.recentResults || []);
      setAnnouncements(statsRes.data.announcements || []);
      setCourseStats(statsRes.data.courseStats || []);

      const coursesRes = await API.get('/courses');
      setCourses(coursesRes.data);
      if (coursesRes.data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(coursesRes.data[0].courseId);
      }

      const usersRes = await API.get('/admin/users');
      setUsers(usersRes.data);

      const feedbackRes = await API.get('/admin/feedback');
      setFeedback(feedbackRes.data);

    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin workspace stats.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/courses', courseForm);
      toast.success(`Course ${courseForm.name} created successfully!`);
      setCourseForm({ name: '', courseId: '', description: '', difficulty: 'Beginner', estimatedTime: '', image: '', isPublished: true });
      fetchAdminWorkspace();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm(`Are you sure you want to delete course ${courseId}?`)) return;
    try {
      await API.delete(`/admin/courses/${courseId}`);
      toast.success('Course removed.');
      fetchAdminWorkspace();
    } catch (err) {
      toast.error('Error removing course');
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return toast.error('Please select a course.');
    
    // Parse importantPoints and tips from comma strings to arrays
    const parsedPoints = noteForm.importantPoints.split(',').map(p => p.trim()).filter(Boolean);
    const parsedTips = noteForm.tips.split(',').map(t => t.trim()).filter(Boolean);

    try {
      await API.post(`/admin/courses/${selectedCourseId}/chapters`, {
        title: noteForm.title,
        definition: noteForm.definition,
        explanation: noteForm.explanation,
        syntax: noteForm.syntax,
        codeExample: noteForm.codeExample,
        output: noteForm.output,
        realWorldExample: noteForm.realWorldExample,
        importantPoints: parsedPoints,
        tips: parsedTips,
        summary: noteForm.summary
      });
      toast.success('Chapter note added successfully!');
      setNoteForm({ title: '', definition: '', explanation: '', syntax: '', codeExample: '', output: '', realWorldExample: '', importantPoints: '', tips: '', summary: '' });
      fetchAdminWorkspace();
    } catch (err) {
      toast.error('Error saving chapter note');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return toast.error('Please select a course.');

    let parsedOptions = [];
    if (questionForm.type === 'MCQ') {
      parsedOptions = questionForm.optionsStr.split(',').map(o => o.trim());
      if (parsedOptions.length !== 4) {
        return toast.error('Please specify exactly 4 comma-separated options.');
      }
    } else if (questionForm.type === 'True/False') {
      parsedOptions = ['True', 'False'];
    }

    try {
      await API.post(`/admin/courses/${selectedCourseId}/questions`, {
        questionText: questionForm.questionText,
        options: parsedOptions,
        correctAnswer: parseInt(questionForm.correctAnswer),
        explanation: questionForm.explanation,
        difficulty: questionForm.difficulty,
        type: questionForm.type,
        tag: questionForm.tag
      });
      toast.success('Assessment question added successfully!');
      setQuestionForm({ questionText: '', optionsStr: '', correctAnswer: 0, explanation: '', difficulty: 'Medium', type: 'MCQ', tag: 'Practice' });
      fetchAdminWorkspace();
    } catch (err) {
      toast.error('Error saving question');
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      const { data } = await API.put(`/admin/users/${userId}/toggle`);
      toast.success(data.message);
      fetchAdminWorkspace();
    } catch (err) {
      toast.error('Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user account permanently?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success('User account deleted.');
      fetchAdminWorkspace();
    } catch (err) {
      toast.error('Error removing user');
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/announcements', announcementForm);
      toast.success('Announcement broadcasted!');
      setAnnouncementForm({ title: '', content: '' });
      fetchAdminWorkspace();
    } catch (err) {
      toast.error('Error posting announcement');
    }
  };

  const handleReplyFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackReply.text) return toast.error('Reply text cannot be empty');
    try {
      await API.put(`/admin/feedback/${feedbackReply.id}/reply`, { reply: feedbackReply.text });
      toast.success('Reply submitted successfully!');
      setFeedbackReply({ id: '', text: '' });
      fetchAdminWorkspace();
    } catch (err) {
      toast.error('Error submitting feedback reply');
    }
  };

  // Client-Side CSV/Excel Exporter
  const handleExportCSV = () => {
    const headers = ['Student Name', 'Course Name', 'Score', 'Percentage', 'Time Taken (Sec)', 'Pass Status', 'Date'];
    const rows = recentResults.map((r) => [
      `"${r.studentName}"`,
      `"${r.courseName}"`,
      `"${r.marks}/${r.totalQuestions}"`,
      `"${r.percentage}%"`,
      r.timeTaken,
      r.passStatus ? 'PASSED' : 'FAILED',
      `"${new Date(r.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eduquiz_assessments_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV scorecard report exported! 📊');
  };

  const handleUpdateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success(`Platform settings updated!`);
  };

  // Filter lists
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredResults = recentResults.filter(r =>
    r.studentName.toLowerCase().includes(resultSearch.toLowerCase()) ||
    r.courseName.toLowerCase().includes(resultSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      
      {/* Sidebar navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={() => {
          logout();
          window.location.href = '/';
        }}
      />

      {/* Main Admin Panels viewports */}
      <div className="flex-grow w-full space-y-6">
        
        {/* Tab: Dashboard Metrics */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FaChartLine className="text-rose-500" /> Platform Executive Summary
            </h2>
            
            {/* Top Cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
                <p className="text-3xl font-black text-slate-855 dark:text-white">{stats?.totalStudents || 0}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Chapters</p>
                <p className="text-3xl font-black text-slate-855 dark:text-white">{stats?.totalTopics || 0}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Exam Questions</p>
                <p className="text-3xl font-black text-slate-855 dark:text-white">{stats?.totalQuestions || 0}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today Logins</p>
                <p className="text-3xl font-black text-slate-855 dark:text-white">{stats?.todayUsers || 0}</p>
              </div>
            </div>

            {/* Middle Stats split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Course-wise performance pure CSS mock charts */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-850 pb-2">Course Assessment Averages</h3>
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 text-xs">
                  {courseStats.map((cs, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-350">
                        <span>{cs.courseName}</span>
                        <span>{cs.avgScore}% avg ({cs.attemptsCount} attempts)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${cs.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcements Feed */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-1"><FaBullhorn className="text-rose-500" /> Active Announcements</h3>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-3 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                        <h4>{ann.title}</h4>
                        <span className="text-[10px] text-slate-400 font-normal">{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: Students Management */}
        {activeTab === 'students' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-slate-855 dark:text-white flex items-center gap-2">
                <FaUserGraduate className="text-rose-500" /> Registered Students Directory
              </h2>
              {/* Search */}
              <div className="relative w-full sm:max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <FaSearch className="text-xs" />
                </span>
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students by name, email..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-850">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/20 border-b border-slate-150 dark:border-slate-850 text-slate-450 font-bold">
                    <th className="p-3">Avatar</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Points</th>
                    <th className="p-3">Streak</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/40">
                      <td className="p-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-500 font-bold flex items-center justify-center text-[10px]">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-slate-800 dark:text-white">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 font-semibold">{u.xpPoints || 0} XP</td>
                      <td className="p-3">🔥 {u.streakCount || 0} days</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${u.isDisabled ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/30' : 'bg-emerald-100 text-emerald-800'}`}>
                          {u.isDisabled ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="p-3 flex justify-center items-center gap-2">
                        {u.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleToggleUser(u._id)}
                              className={`p-1.5 rounded-md text-xs font-bold cursor-pointer ${u.isDisabled ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                              title={u.isDisabled ? 'Re-enable account' : 'Suspend account'}
                            >
                              {u.isDisabled ? <FaUserCheck /> : <FaUserSlash />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-1.5 rounded-md bg-slate-50 text-slate-400 hover:text-rose-500 cursor-pointer"
                              title="Delete account"
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Manage Courses */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            
            {/* Create course */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FaPlus className="text-rose-500 text-xs" /> Publish New Course Track
              </h2>
              <form onSubmit={handleCreateCourse} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Course Title (e.g. MongoDB)"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                />
                <input
                  type="text"
                  required
                  placeholder="URL Code ID (e.g. mongodb)"
                  value={courseForm.courseId}
                  onChange={(e) => setCourseForm({ ...courseForm, courseId: e.target.value.toLowerCase() })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                />
                <div className="relative flex items-center w-full">
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                    className="appearance-none pl-3 pr-9 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="Beginner">Beginner Level</option>
                    <option value="Intermediate">Intermediate Level</option>
                    <option value="Advanced">Advanced Level</option>
                  </select>
                  <div className="absolute right-3 pointer-events-none text-slate-400 text-[10px]">▼</div>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Duration (e.g. 3 hours)"
                  value={courseForm.estimatedTime}
                  onChange={(e) => setCourseForm({ ...courseForm, estimatedTime: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                />
                <textarea
                  required
                  placeholder="Enter detailed syllabus description..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden sm:col-span-2"
                ></textarea>
                <button type="submit" className="sm:col-span-2 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-xs transition-all shadow-md cursor-pointer">
                  Save Course Path
                </button>
              </form>
            </div>

            {/* Catalog */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-850 pb-2">Active Course Tracks Catalog</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                {courses.map((c) => (
                  <div key={c._id} className="p-4 border border-slate-150 dark:border-slate-850 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{c.name}</p>
                      <p className="text-[10px] text-slate-400">Chapters: {c.chaptersCount} | Exam Qs: {c.questionsCount} | Time: {c.estimatedTime}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCourse(c.courseId)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Course Chapters and Notes */}
        {activeTab === 'chapters' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FaClipboardList className="text-rose-500" /> Create W3Schools Notes Chapter
            </h2>
            <form onSubmit={handleAddChapter} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Select Target Course</label>
                  <div className="relative flex items-center w-full">
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="appearance-none pl-3 pr-9 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      {courses.map(c => <option key={c._id} value={c.courseId}>{c.name}</option>)}
                    </select>
                    <div className="absolute right-3 pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Chapter Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Variable Declarations"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-250 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Concept Definition</label>
                  <textarea
                    required
                    placeholder="e.g. Variables are containers for storing data values..."
                    value={noteForm.definition}
                    onChange={(e) => setNoteForm({ ...noteForm, definition: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Detailed Theory Explanation</label>
                  <textarea
                    required
                    placeholder="Enter comprehensive explanation text details..."
                    value={noteForm.explanation}
                    onChange={(e) => setNoteForm({ ...noteForm, explanation: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Syntax structure</label>
                  <textarea
                    required
                    placeholder="e.g. let name = value;"
                    value={noteForm.syntax}
                    onChange={(e) => setNoteForm({ ...noteForm, syntax: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden font-mono text-pink-500"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Copiable Code Example</label>
                  <textarea
                    required
                    placeholder="Code snippet block..."
                    value={noteForm.codeExample}
                    onChange={(e) => setNoteForm({ ...noteForm, codeExample: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden font-mono text-indigo-500"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Browser Console Output</label>
                  <input
                    type="text"
                    required
                    placeholder="Result print text..."
                    value={noteForm.output}
                    onChange={(e) => setNoteForm({ ...noteForm, output: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Real-World Case Example</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shopping cart calculation..."
                    value={noteForm.realWorldExample}
                    onChange={(e) => setNoteForm({ ...noteForm, realWorldExample: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Key Takeaways (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Declared with let, block scoped"
                    value={noteForm.importantPoints}
                    onChange={(e) => setNoteForm({ ...noteForm, importantPoints: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Expert Tips (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Always prefer const over let"
                    value={noteForm.tips}
                    onChange={(e) => setNoteForm({ ...noteForm, tips: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Chapter Summary</label>
                <textarea
                  required
                  placeholder="Summary takeaways..."
                  value={noteForm.summary}
                  onChange={(e) => setNoteForm({ ...noteForm, summary: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                ></textarea>
              </div>

              <button type="submit" className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer">
                Save Note Chapter
              </button>
            </form>
          </div>
        )}

        {/* Tab: Quiz Questions management */}
        {activeTab === 'questions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FaQuestionCircle className="text-rose-500" /> Create Assessment Question
            </h2>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Select Target Course</label>
                  <div className="relative flex items-center w-full">
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="appearance-none pl-3 pr-9 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      {courses.map(c => <option key={c._id} value={c.courseId}>{c.name}</option>)}
                    </select>
                    <div className="absolute right-3 pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Difficulty</label>
                  <div className="relative flex items-center w-full">
                    <select
                      value={questionForm.difficulty}
                      onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                      className="appearance-none pl-3 pr-9 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <div className="absolute right-3 pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tags</label>
                  <div className="relative flex items-center w-full">
                    <select
                      value={questionForm.tag}
                      onChange={(e) => setQuestionForm({ ...questionForm, tag: e.target.value })}
                      className="appearance-none pl-3 pr-9 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="Practice">Practice Question</option>
                      <option value="Exam">Official Certification</option>
                      <option value="Interview">Interview Prep</option>
                    </select>
                    <div className="absolute right-3 pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Question Text</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is the output of typeof NaN?"
                  value={questionForm.questionText}
                  onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Options (MCQ: 4 comma-separated strings)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. number, string, undefined, object"
                    value={questionForm.optionsStr}
                    onChange={(e) => setQuestionForm({ ...questionForm, optionsStr: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Correct Answer Index (0 for A, 1 for B, 2 for C, 3 for D)</label>
                  <div className="relative flex items-center w-full">
                    <select
                      value={questionForm.correctAnswer}
                      onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: parseInt(e.target.value) })}
                      className="appearance-none pl-3 pr-9 py-2.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value={0}>Option A (First)</option>
                      <option value={1}>Option B (Second)</option>
                      <option value={2}>Option C (Third)</option>
                      <option value={3}>Option D (Fourth)</option>
                    </select>
                    <div className="absolute right-3 pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Answer Explanation</label>
                <textarea
                  required
                  placeholder="Provide detailed explanation analysis..."
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                ></textarea>
              </div>

              <button type="submit" className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer">
                Save Question
              </button>
            </form>
          </div>
        )}

        {/* Tab: Results History and Exporter */}
        {activeTab === 'results' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-slate-855 dark:text-white flex items-center gap-2">
                <FaPoll className="text-rose-500" /> Student Scorecard Reports
              </h2>
              
              {/* Exporter and Search */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-grow sm:max-w-xs">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <FaSearch className="text-xs" />
                  </span>
                  <input
                    type="text"
                    value={resultSearch}
                    onChange={(e) => setResultSearch(e.target.value)}
                    placeholder="Search results by name, course..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  />
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                >
                  <FaFileExcel /> Export CSV (Excel)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-850">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/20 border-b border-slate-150 dark:border-slate-850 text-slate-450 font-bold">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Course Name</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Attempt Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                  {filteredResults.map((r, idx) => (
                    <tr key={r._id || idx} className="hover:bg-slate-50/40">
                      <td className="p-3 font-bold text-slate-800 dark:text-white">{r.studentName}</td>
                      <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">{r.courseName}</td>
                      <td className="p-3 font-semibold">{r.marks} / {r.totalQuestions}</td>
                      <td className="p-3">{r.percentage}%</td>
                      <td className="p-3">{Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${r.passStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {r.passStatus ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Analytics Panels */}
        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-855 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FaChartLine className="text-rose-500" /> Platform Growth & Engagement Charts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Chart: Most Popular Courses */}
              <div className="space-y-4 p-4 border border-slate-150 dark:border-slate-850 rounded-2xl bg-slate-50/20">
                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Top Assessment Attempts</h3>
                <div className="flex h-48 items-end gap-3.5 pt-4 px-2 border-b border-slate-200 dark:border-slate-800">
                  {courseStats.slice(0, 5).map((cs, idx) => {
                    const maxHeight = 100;
                    const heightVal = cs.attemptsCount > 0 ? Math.min(Math.round((cs.attemptsCount / 10) * maxHeight), maxHeight) : 10;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{cs.attemptsCount}</span>
                        <div 
                          className="w-full bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg transition-all duration-1000 ease-out"
                          style={{ height: `${heightVal}px` }}
                        ></div>
                        <span className="text-[10px] text-slate-400 truncate max-w-[60px]">{cs.courseName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart: Average Marks comparison */}
              <div className="space-y-4 p-4 border border-slate-150 dark:border-slate-850 rounded-2xl bg-slate-50/20">
                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Syllabus Pass Rates</h3>
                <div className="flex h-48 items-end gap-3.5 pt-4 px-2 border-b border-slate-200 dark:border-slate-800">
                  {courseStats.slice(0, 5).map((cs, idx) => {
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{cs.avgScore}%</span>
                        <div 
                          className="w-full bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-lg transition-all duration-1000 ease-out"
                          style={{ height: `${cs.avgScore}px` }}
                        ></div>
                        <span className="text-[10px] text-slate-400 truncate max-w-[60px]">{cs.courseName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Leaderboards */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FaTrophy className="text-yellow-500" /> Leaderboard Rankings
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {users.sort((a,b) => b.xpPoints - a.xpPoints).slice(0, 10).map((u, idx) => (
                <div key={u._id} className="py-3 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-black text-slate-400 w-6">#{idx+1}</span>
                    <span className="font-bold text-slate-800 dark:text-white">{u.name}</span>
                  </div>
                  <span className="font-black text-indigo-650 dark:text-indigo-400">{u.xpPoints} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Certificates Verification logs */}
        {activeTab === 'certificates' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-855 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FaAward className="text-indigo-500" /> Verified Credentials Registry
            </h2>
            
            <div className="space-y-3">
              {recentResults.filter(r => r.percentage >= 80).map((r, idx) => (
                <div key={idx} className="p-3.5 border border-slate-150 dark:border-slate-850 rounded-xl flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Cert ID: CERT-{r._id?.slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] text-slate-400">Issued to: {r.studentName} | Course: {r.courseName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold border border-emerald-200/50">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Email dispatches SMTP parameters */}
        {activeTab === 'email' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FaEnvelope className="text-indigo-500" /> Email dispatch configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4 text-xs leading-relaxed">
                <p>
                  The platform uses **Nodemailer** to automatically dispatch scorecards to student emails immediately upon test submissions.
                </p>
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/20 text-indigo-800 dark:text-indigo-300">
                  <h4 className="font-bold mb-1">SMTP Fallback Status</h4>
                  <p>
                    If SMTP configuration is missing in `.env`, the server automatically provisions virtual **Ethereal Mail** accounts, outputting web review links to logs.
                  </p>
                </div>
              </div>

              <div className="p-5 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-4">
                <h3 className="font-bold text-xs text-slate-500 uppercase">SMTP config checklist</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Host</span>
                    <span className="font-mono text-slate-700 dark:text-slate-200">smtp.gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Port</span>
                    <span className="font-mono text-slate-700 dark:text-slate-200">587 (TLS)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dispatches Status</span>
                    <span className="font-bold text-emerald-500 flex items-center gap-1"><FaCheckCircle /> ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Feedbacks inbox */}
        {activeTab === 'feedback' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FaComments className="text-rose-500" /> Student Support & Feedback Inbox
            </h2>

            <div className="space-y-4">
              {feedback.map((f) => (
                <div 
                  key={f._id} 
                  className="p-5 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-3.5 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white">{f.studentName}</span>
                      <span className="text-[10px] text-slate-400 ml-2">Rating: {f.rating ? '⭐'.repeat(Math.max(0, Math.min(5, Number(f.rating) || 0))) : 'N/A'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-450 font-bold uppercase">
                      {f.type}
                    </span>
                  </div>

                  <p className="text-slate-655 dark:text-slate-300 italic leading-relaxed">
                    "{f.comment}"
                  </p>

                  {f.adminReply ? (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850/60 text-slate-500 leading-relaxed">
                      <strong className="text-slate-750 dark:text-slate-350 block mb-0.5">Admin Reply:</strong>
                      "{f.adminReply}"
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        feedbackReply.id = f._id;
                        handleReplyFeedback(e);
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        required
                        placeholder="Type reply message here..."
                        value={feedbackReply.id === f._id ? feedbackReply.text : ''}
                        onChange={(e) => setFeedbackReply({ id: f._id, text: e.target.value })}
                        className="flex-grow p-2 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                      />
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl font-bold shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <FaReply className="text-[10px]" /> Reply
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Announcements builder */}
        {activeTab === 'announcements' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FaBullhorn className="text-rose-500" /> Broadcast Update Announcement
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form */}
              <div className="md:col-span-1 p-5 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-4">
                <h3 className="font-bold text-xs text-slate-500 uppercase">Write Announcement</h3>
                <form onSubmit={handlePostAnnouncement} className="space-y-3.5">
                  <input
                    type="text"
                    required
                    placeholder="Announcement Title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  />
                  <textarea
                    required
                    rows="4"
                    placeholder="Announcement content detail..."
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-hidden"
                  ></textarea>
                  <button type="submit" className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1">
                    <FaPaperPlane className="text-[10px]" /> Post Announcement
                  </button>
                </form>
              </div>

              {/* Announcements feed */}
              <div className="md:col-span-2 space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                      <h4>{ann.title}</h4>
                      <span className="text-[10px] text-slate-400 font-normal">{new Date(ann.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FaCog className="text-indigo-500" /> Platform Configuration Parameters
            </h2>

            <div className="max-w-md space-y-6 text-xs">
              {/* Pass Score Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Standard Passing Threshold</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{settings.passScore}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="70"
                  value={settings.passScore}
                  onChange={(e) => handleUpdateSettings('passScore', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Cert Score Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Certificate Eligibility Threshold</span>
                  <span className="text-rose-500">{settings.certScore}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="90"
                  value={settings.certScore}
                  onChange={(e) => handleUpdateSettings('certScore', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Toggles settings */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">Allow SMTP Fallback</p>
                    <p className="text-[10px] text-slate-400">Allow test test emails if standard SMTP parameters fail.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowSMTPFallback}
                    onChange={(e) => handleUpdateSettings('allowSMTPFallback', e.target.checked)}
                    className="w-4 h-4 text-indigo-650 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-755 dark:text-slate-200 text-rose-500">Platform Lockdown</p>
                    <p className="text-[10px] text-slate-400">Enable absolute suspension of new registration submissions.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.platformLockdown}
                    onChange={(e) => handleUpdateSettings('platformLockdown', e.target.checked)}
                    className="w-4 h-4 text-rose-600 bg-slate-100 border-slate-350 rounded focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Admin;
export { Admin };
