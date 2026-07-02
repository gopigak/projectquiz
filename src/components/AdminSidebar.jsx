import React from 'react';
import { 
  FaHome, 
  FaUserGraduate, 
  FaBookOpen, 
  FaBookmark, 
  FaFileAlt, 
  FaQuestionCircle, 
  FaPoll, 
  FaChartBar, 
  FaTrophy, 
  FaCertificate, 
  FaEnvelope, 
  FaComments, 
  FaBullhorn, 
  FaCog, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed, onLogout }) => {
  const menuItems = [
    { id: 'stats', label: 'Dashboard', icon: <FaHome /> },
    { id: 'students', label: 'Students', icon: <FaUserGraduate /> },
    { id: 'courses', label: 'Courses', icon: <FaBookOpen /> },
    { id: 'chapters', label: 'Course Chapters', icon: <FaBookmark /> },
    { id: 'questions', label: 'Quiz Questions', icon: <FaQuestionCircle /> },
    { id: 'results', label: 'Results', icon: <FaPoll /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FaTrophy /> },
    { id: 'certificates', label: 'Certificates', icon: <FaCertificate /> },
    { id: 'email', label: 'Email Management', icon: <FaEnvelope /> },
    { id: 'feedback', label: 'Feedback', icon: <FaComments /> },
    { id: 'announcements', label: 'Announcements', icon: <FaBullhorn /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
  ];

  return (
    <aside 
      className={`glass-panel border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-6.5rem)] sticky top-24 transition-all duration-300 rounded-2xl shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header Collapse Control */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-850">
        {!collapsed && (
          <span className="text-xs font-black bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent tracking-widest uppercase">
            Admin Console
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors mx-auto cursor-pointer"
        >
          {collapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
        </button>
      </div>

      {/* Menu Links */}
      <div className="flex-grow overflow-y-auto p-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center rounded-xl py-2.5 transition-all text-xs font-bold cursor-pointer ${
                collapsed ? 'justify-center px-0' : 'px-4 gap-3'
              } ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-655 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
              title={collapsed ? item.label : ''}
            >
              <span className={isActive ? 'text-white text-base' : 'text-slate-400 text-base group-hover:text-slate-600'}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Logout Row */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-850">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-xl py-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-xs font-bold cursor-pointer ${
            collapsed ? 'justify-center px-0' : 'px-4 gap-3'
          }`}
          title={collapsed ? 'Log Out' : ''}
        >
          <FaSignOutAlt className="text-base shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;
export { AdminSidebar };
