import React, { useState } from 'react';
import { FaCode, FaLightbulb, FaTerminal, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import CodePlayground from './CodePlayground';

const NoteCard = ({ chapter, activeTopicIndex = 0 }) => {
  const {
    title,
    definition,
    explanation,
    syntax,
    codeExample,
    output,
    realWorldExample,
    interviewQuestions = [],
    importantPoints = [],
    tips = [],
    summary
  } = chapter;

  const [activeQuestion, setActiveQuestion] = useState(null);

  const renderTopicContent = () => {
    switch (activeTopicIndex) {
      case 0:
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-indigo-50/50 dark:bg-indigo-950/15 border-l-4 border-indigo-500 p-4 rounded-r-xl">
              <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-1">
                Definition
              </p>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {definition}
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-350 leading-relaxed">
              {explanation}
            </p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            {syntax && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Syntax</h4>
                <code className="block bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-xl font-mono text-sm overflow-x-auto text-pink-600 dark:text-pink-400 whitespace-pre">
                  {syntax}
                </code>
              </div>
            )}
            {importantPoints && importantPoints.length > 0 && (
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/20 dark:bg-indigo-950/5 space-y-2">
                <h5 className="text-xs font-bold text-indigo-600 uppercase tracking-widest select-none">Key Takeaways</h5>
                <ul className="list-disc list-inside text-xs text-slate-655 dark:text-slate-350 space-y-1">
                  {importantPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            {codeExample && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                  💡 Interactive Sandbox
                </h4>
                <CodePlayground initialCode={codeExample} />
              </div>
            )}
            {output && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                  💻 Expected Output Console
                </h4>
                <pre className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-xl font-mono text-xs overflow-x-auto text-emerald-600 dark:text-emerald-400">
                  {output}
                </pre>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            {realWorldExample && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                  🚀 Real-World Application
                </h4>
                <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed italic bg-amber-50/20 dark:bg-amber-950/10 p-3.5 rounded-xl border border-amber-200/30">
                  {realWorldExample}
                </p>
              </div>
            )}
            {tips && tips.length > 0 && (
              <div className="p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/5 space-y-2">
                <h5 className="text-xs font-bold text-amber-600 uppercase tracking-widest select-none">Expert Tips</h5>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}
            {interviewQuestions && interviewQuestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider select-none">Interview Questions</h4>
                <div className="space-y-2">
                  {interviewQuestions.map((q, idx) => (
                    <div 
                      key={idx} 
                      className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setActiveQuestion(activeQuestion === idx ? null : idx)}
                        className="w-full text-left flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors font-medium text-sm text-slate-800 dark:text-slate-200 cursor-pointer select-none"
                      >
                        <span>Q{idx+1}: {q.question}</span>
                        {activeQuestion === idx ? <span>▲</span> : <span>▼</span>}
                      </button>
                      {activeQuestion === idx && (
                        <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                          {q.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {summary && (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 text-slate-500 dark:text-slate-400 text-xs">
                <strong className="text-slate-700 dark:text-slate-200 mr-1 uppercase text-[10px] tracking-wider select-none">Summary:</strong>
                {summary}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
      
      {/* Title */}
      <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold uppercase tracking-wider">
            Topic {activeTopicIndex + 1} of 4
          </span>
        </h2>
      </div>

      {/* Render selected topic block */}
      {renderTopicContent()}

    </div>
  );
};

export default NoteCard;
export { NoteCard };
