import React, { useState, useEffect } from 'react';
import { FaPlay, FaCopy, FaCheck, FaTerminal } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CodePlayground = ({ initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [sandboxCode, setSandboxCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setSandboxCode(initialCode);
  }, [initialCode]);

  const runSandboxCode = () => {
    setSandboxCode(code);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Playground code copied! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const injectedCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 16px;
            background-color: #ffffff;
            color: #1e293b;
          }
        </style>
      </head>
      <body>
        ${sandboxCode}
      </body>
    </html>
  `;

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col h-[480px] bg-slate-900">
      
      {/* Editor Control Header */}
      <div className="bg-slate-800 dark:bg-black px-4 py-3 flex items-center justify-between border-b border-slate-700 select-none">
        <span className="flex items-center gap-2 text-slate-350 text-xs font-mono">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="ml-1 text-slate-300">interactive-sandbox.html</span>
        </span>

        <div className="flex items-center space-x-3.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer bg-slate-750 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <button
            onClick={runSandboxCode}
            className="flex items-center gap-1.5 text-white bg-emerald-600 hover:bg-emerald-700 text-xs font-bold transition-all px-4 py-1.5 rounded-lg shadow-md hover:shadow-emerald-500/20 cursor-pointer"
          >
            <FaPlay className="text-[10px]" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Editor Workspaces split */}
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden h-full">
        {/* Editor Code Area (Left) */}
        <div className="flex-1 h-full border-r border-slate-700 relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 bg-slate-900 text-indigo-300 font-mono text-sm leading-relaxed focus:outline-hidden resize-none overflow-y-auto align-top border-none"
            spellCheck="false"
          />
        </div>

        {/* Dynamic Frame Output (Right) */}
        <div className="flex-1 h-full bg-white flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-[10px] font-bold text-slate-550 flex items-center gap-1">
            <FaTerminal className="text-slate-400" /> BROWSER RESULT PREVIEW
          </div>
          <iframe
            title="Code Playground output"
            sandbox="allow-scripts allow-modals"
            srcDoc={injectedCode}
            className="w-full flex-grow bg-white border-none"
          />
        </div>
      </div>

    </div>
  );
};

export default CodePlayground;
export { CodePlayground };
