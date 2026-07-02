import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import Loader from '../components/Loader';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';
import { FaArrowLeft, FaArrowRight, FaFlag, FaPaperPlane, FaKeyboard } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeQuiz, fetchCourseQuiz, submitQuizAnswers, loading } = useCourse();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const timerRef = useRef(null);

  // Extract chapterIndex from state parameter (fallback to -1 for final certification)
  const chapterIndex = location.state?.chapterIndex !== undefined && location.state?.chapterIndex !== null
    ? parseInt(location.state.chapterIndex)
    : -1;

  useEffect(() => {
    fetchCourseQuiz(id, chapterIndex).then((data) => {
      if (data && data.questions) {
        // 60 seconds per question
        const totalDuration = data.questions.length * 60;
        setDuration(totalDuration);

        // Resume state check
        const cacheKey = `quiz_answers_${id}_chap_${chapterIndex}`;
        const saved = localStorage.getItem(cacheKey);
        if (saved) {
          setAnswers(JSON.parse(saved));
          toast.success('Resumed previous assessment state! 📁');
        }
      }
    });

    setElapsedTime(0);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id, chapterIndex]);

  // Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        handleSelectOption(parseInt(e.key) - 1);
      }
      if (e.key === 'ArrowRight') {
        if (currentIdx < (activeQuiz?.questions?.length || 0) - 1) {
          handleNext();
        }
      }
      if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, activeQuiz, answers]);

  if (loading || !activeQuiz || activeQuiz.courseId !== id) {
    return <Loader />;
  }

  const { name, chapterTitle = 'Final Certification Exam', questions = [] } = activeQuiz;
  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (optionIndex) => {
    const updated = { ...answers, [String(currentIdx)]: optionIndex };
    setAnswers(updated);
    // Auto Save to localStorage
    const cacheKey = `quiz_answers_${id}_chap_${chapterIndex}`;
    localStorage.setItem(cacheKey, JSON.stringify(updated));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (answers[String(currentIdx)] === undefined) {
      const updated = { ...answers, [String(currentIdx)]: -1 };
      setAnswers(updated);
      const cacheKey = `quiz_answers_${id}_chap_${chapterIndex}`;
      localStorage.setItem(cacheKey, JSON.stringify(updated));
    }
    handleNext();
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isAutoSubmit) {
      toast.error("Time is up! Submitting exam automatically...");
    } else {
      const answeredCount = Object.keys(answers).filter(k => answers[k] !== -1).length;
      const confirmSubmit = window.confirm(`You have answered ${answeredCount} of ${questions.length} questions. Are you sure you want to submit?`);
      if (!confirmSubmit) {
        timerRef.current = setInterval(() => {
          setElapsedTime((prev) => prev + 1);
        }, 1000);
        return;
      }
    }

    const submissionAnswers = { ...answers };
    questions.forEach((_, idx) => {
      if (submissionAnswers[String(idx)] === undefined) {
        submissionAnswers[String(idx)] = -1;
      }
    });

    const result = await submitQuizAnswers(id, submissionAnswers, elapsedTime, chapterIndex);
    if (result) {
      const cacheKey = `quiz_answers_${id}_chap_${chapterIndex}`;
      localStorage.removeItem(cacheKey);
      toast.success('Exam submitted successfully! Results compiled.');
      navigate(`/courses/${id}/result`, { state: { resultDetails: result } });
    }
  };

  const handlePaletteClick = (idx) => {
    setCurrentIdx(idx);
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k] !== -1).length;

  return (
    <div className="space-y-6">
      
      {/* Top Exam Header */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-white">
            {name}: {chapterTitle}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <FaKeyboard className="text-indigo-500" /> Keyboard Shortcuts: [1-4] Select | [←/→] Navigate
          </p>
        </div>

        {/* Timer countdown component */}
        {duration > 0 && (
          <Timer duration={duration} onTimeout={() => handleSubmit(true)} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left/Main Column: Active Question Card */}
        <div className="lg:col-span-3 space-y-6">
          {currentQuestion ? (
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIdx + 1}
              selectedOption={answers[String(currentIdx)]}
              onSelectOption={handleSelectOption}
            />
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl">
              <p className="text-slate-400 text-xs italic">Exam question loading...</p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs gap-3">
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 flex items-center gap-1 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
              >
                <FaArrowLeft className="text-[9px]" /> Prev
              </button>
              
              <button
                onClick={handleSkip}
                disabled={currentIdx === questions.length - 1}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 text-slate-550 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FaFlag className="text-[10px]" /> Skip Question
              </button>
            </div>

            {currentIdx === questions.length - 1 ? (
              <button
                onClick={() => handleSubmit(false)}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <FaPaperPlane className="text-[10px]" /> Submit Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 transition-all cursor-pointer"
              >
                Next <FaArrowRight className="text-[9px]" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-0.5 select-none">
              Questions Palette
            </h3>
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((_, idx) => {
                const answerStatus = answers[String(idx)];
                const isCurrent = currentIdx === idx;

                let btnClass = 'border-slate-200 text-slate-550 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-850';
                
                if (answerStatus !== undefined && answerStatus !== -1) {
                  btnClass = 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700';
                } else if (answerStatus === -1) {
                  btnClass = 'bg-slate-200 border-slate-250 text-slate-655 dark:bg-slate-850 dark:border-slate-750 dark:text-slate-300';
                }

                if (isCurrent) {
                  btnClass += ' ring-4 ring-indigo-500/30 font-black scale-105';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handlePaletteClick(idx)}
                    className={`w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-850 text-[10px] select-none">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-indigo-650 inline-block"></span>
              <span className="text-slate-500 font-medium">Answered Question</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-800 inline-block border border-slate-300 dark:border-slate-700"></span>
              <span className="text-slate-500 font-medium">Skipped/Flagged Question</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded border border-dashed border-slate-300 inline-block"></span>
              <span className="text-slate-500 font-medium">Unvisited Question</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
            <ProgressBar
              current={answeredCount}
              total={questions.length}
              label="Completion Status"
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default Quiz;
export { Quiz };
