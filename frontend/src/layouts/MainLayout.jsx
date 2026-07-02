import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
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
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
export { MainLayout };
