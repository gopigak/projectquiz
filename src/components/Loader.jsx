import React from 'react';

const Loader = ({ fullPage = true }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullPage ? 'min-h-[70vh] w-full' : 'p-6'
      }`}
    >
      <div className="relative w-16 h-16">
        {/* Glowing outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
        {/* Inner backwards spinning ring */}
        <div className="absolute inset-2 rounded-full border-4 border-violet-500/10 border-b-violet-500 animate-spin [animation-direction:reverse]"></div>
        {/* Core static blur */}
        <div className="absolute inset-5 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 blur-xs opacity-60"></div>
      </div>
      <p className="mt-4 text-sm font-semibold tracking-widest text-indigo-500 animate-pulse dark:text-indigo-400">
        LOADING DATA...
      </p>
    </div>
  );
};

export default Loader;
export { Loader };
