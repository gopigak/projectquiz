import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import { 
  FaArrowLeft, 
  FaGraduationCap, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaRedoAlt,
  FaArrowRight,
  FaExclamationTriangle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const CertificateTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCourseDetails, fetchCourseQuiz, submitQuizAnswers, loading: courseLoading } = useCourse();
  const { user, fetchUserProfile } = useAuth();

  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1200); // 20 minutes (1200 seconds)
  const [testActive, setTestActive] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(1200);

  // Security Lock Bypass check:
  // User must complete all chapters in this course to access the test.
  useEffect(() => {
    const initializeTest = async () => {
      const details = await fetchCourseDetails(id);
      if (!details) {
        toast.error('Failed to load course details.');
        return navigate('/dashboard');
      }
      setCourse(details);

      // Verify that all chapters are completed
      const chaptersCount = details.chaptersCount;
      const completedChaptersForCourse = user?.completedChapters?.filter(c => c.startsWith(id)) || [];
      
      if (completedChaptersForCourse.length < chaptersCount) {
        toast.error('Access denied: Complete all chapters and topics to unlock the Certificate Test.');
        return navigate(`/courses/${id}`);
      }

      // Load quiz questions for final certification exam (chapterIndex = -1)
      const quizData = await fetchCourseQuiz(id, -1);
      if (quizData && quizData.questions) {
        setQuestions(quizData.questions);
        // Shuffle questions
        const shuffled = shuffleQuestions(quizData.questions);
        setShuffledQuestions(shuffled);
      }
    };

    if (user) {
      initializeTest();
    }
  }, [id, user]);

  // Timer Effect
  useEffect(() => {
    if (testActive && timeRemaining > 0 && !testFinished) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testActive, testFinished]);

  const shuffleQuestions = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startTest = () => {
    setAnswers({});
    setCurrentIdx(0);
    setTimeRemaining(1200);
    startTimeRef.current = 1200;
    setTestActive(true);
    setTestFinished(false);
    setTestResult(null);
    toast.success('Certificate Test started! You have 20 minutes. Good luck! 🚀');
  };

  const handleSelectOption = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [String(currentIdx)]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIdx < shuffledQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const unansweredCount = shuffledQuestions.length - Object.keys(answers).length;

  const handleSubmitRequest = () => {
    // Prevent skipping mandatory questions: alert if any question is skipped
    if (unansweredCount > 0) {
      return toast.error(`Mandatory: Please answer all questions before submitting. You have ${unansweredCount} unanswered questions left.`);
    }
    setShowSubmitConfirm(true);
  };

  const submitTest = async () => {
    setShowSubmitConfirm(false);
    setTestActive(false);
    setTestFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTaken = startTimeRef.current - timeRemaining;

    // Convert keys from shuffled indices back to original indices to evaluate correctly
    const evaluatedAnswers = {};
    shuffledQuestions.forEach((shuffledQ, shuffledIdx) => {
      const originalIdx = questions.findIndex(q => q.questionText === shuffledQ.questionText);
      const selectedOption = answers[String(shuffledIdx)];
      if (originalIdx !== -1 && selectedOption !== undefined) {
        evaluatedAnswers[String(originalIdx)] = selectedOption;
      }
    });

    const res = await submitQuizAnswers(id, evaluatedAnswers, timeTaken, -1);
    if (res) {
      setTestResult(res);
      await fetchUserProfile();
      if (res.result?.passStatus) {
        toast.success('Congratulations! You passed the Certificate Test! 🏆🎓');
      } else {
        toast.error('Test failed. Review your material and try again.');
      }
    }
  };

  const handleAutoSubmit = () => {
    toast.error('Time is up! Auto-submitting your test...');
    submitTest();
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (courseLoading || !course || shuffledQuestions.length === 0) {
    return <Loader />;
  }

  // Active question details
  const activeQuestion = shuffledQuestions[currentIdx];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-205 dark:border-slate-800 pb-4">
        <Link
          to={`/courses/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-650 transition-colors"
        >
          <FaArrowLeft className="text-[10px]" /> Back to Course Overview
        </Link>
        <span className="text-xs font-bold text-slate-400">
          Curriculum Track: <span className="text-indigo-650 dark:text-indigo-400 font-extrabold">{course.name}</span>
        </span>
      </div>

      {/* 1. START STATE: Instructions Dashboard */}
      {!testActive && !testFinished && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <span className="text-6xl select-none">🎓</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {course.name} Certificate Test
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              This is the final assessment to earn your dynamic digital certificate. You must demonstrate mastery over all chapters in the syllabus.
            </p>
          </div>

          <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Questions</p>
              <p className="text-base font-black text-slate-800 dark:text-white">25 Multiple Choice</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Time Limit</p>
              <p className="text-base font-black text-slate-800 dark:text-white flex items-center justify-center gap-1">
                <FaClock className="text-indigo-500 text-xs" /> 20 Minutes
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Passing Mark</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">70% (18/25 correct)</p>
            </div>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-50/20 border border-amber-250/20 text-xs text-left space-y-1.5">
            <p className="font-extrabold text-amber-600">⚠️ Important Rules:</p>
            <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-0.5">
              <li>Skipping questions is disabled; you must answer all 25 questions.</li>
              <li>Once you start, the timer cannot be paused.</li>
              <li>If the timer reaches 0, the test will submit automatically.</li>
            </ul>
          </div>

          <button
            onClick={startTest}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-650 hover:opacity-90 text-white font-extrabold rounded-2xl text-sm transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
          >
            <FaGraduationCap className="text-base" /> Start Certificate Test
          </button>
        </div>
      )}

      {/* 2. ACTIVE STATE: The Test Workspace */}
      {testActive && !testFinished && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Block: Question Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 space-y-6">
              
              {/* Question Index & Tag */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3 select-none">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Question {currentIdx + 1} of {shuffledQuestions.length}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold uppercase tracking-wider">
                  {activeQuestion.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <p className="text-base font-bold text-slate-800 dark:text-white leading-relaxed">
                  {activeQuestion.questionText}
                </p>
              </div>

              {/* Options selection */}
              <div className="space-y-3">
                {activeQuestion.options.map((option, idx) => {
                  const isSelected = answers[String(currentIdx)] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition-all flex items-center gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-800 dark:bg-indigo-950/20 dark:border-indigo-900 dark:text-indigo-300 shadow-xs'
                          : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-950/30 dark:border-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                        isSelected 
                          ? 'bg-indigo-650 text-white' 
                          : 'bg-slate-105 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Controls bar */}
              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-850 pt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 flex items-center gap-1 transition-all cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-3">
                  {currentIdx === shuffledQuestions.length - 1 ? (
                    <button
                      onClick={handleSubmitRequest}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-extrabold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      Submit Exam
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-705 text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      Next <FaArrowRight className="text-[10px]" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Right Block: Sidebar Timer & Grid Navigator */}
          <div className="space-y-6 lg:sticky lg:top-24 select-none">
            
            {/* Timer Panel */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 text-center space-y-2">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Time Remaining</span>
              <div className="flex items-center justify-center gap-2 text-2xl font-black text-rose-500">
                <FaClock className="text-xl animate-pulse" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>

            {/* Questions Grid Selector */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 space-y-4">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Questions Matrix</p>
              
              <div className="grid grid-cols-5 gap-2 justify-center max-w-[200px] mx-auto">
                {shuffledQuestions.map((_, idx) => {
                  const isAnswered = answers[String(idx)] !== undefined;
                  const isActive = currentIdx === idx;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-indigo-600 border-indigo-650 text-white scale-110 shadow-md'
                          : isAnswered
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="text-[9px] text-slate-400 flex justify-between pt-2 border-t border-slate-100 dark:border-slate-850">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-600"></span> Current</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500"></span> Answered</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-200"></span> Pending</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. FINISHED STATE: Results Presentation */}
      {testFinished && testResult && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
          {testResult.result?.passStatus ? (
            <div className="space-y-6">
              <span className="text-7xl select-none animate-bounce block">🏆</span>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-450 font-extrabold text-[10px] uppercase tracking-wider">
                  Test Passed Successfully!
                </span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Certificate Unlocked!</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Outstanding job! You scored <strong>{testResult.result?.percentage}%</strong> and met the professional passing criteria of 70%.
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="max-w-md mx-auto grid grid-cols-2 gap-4 text-xs select-none">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <p className="font-bold text-slate-400">Total Score</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-1">
                    {testResult.result?.marks} / {testResult.result?.totalQuestions} Correct
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <p className="font-bold text-slate-400">Time Taken</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-1">
                    {Math.floor(testResult.result?.timeTaken / 60)}m {testResult.result?.timeTaken % 60}s
                  </p>
                </div>
              </div>

              <div className="max-w-md mx-auto flex gap-4 pt-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 font-bold rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => navigate(`/courses/${id}/certificate`)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-650 hover:opacity-90 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FaCheckCircle className="text-sm" /> View Certificate
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <span className="text-7xl select-none block">❌</span>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-rose-150 dark:bg-rose-950/50 text-rose-805 dark:text-rose-405 font-extrabold text-[10px] uppercase tracking-wider">
                  Test Failed
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Assessment Attempt Failed</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  You scored <strong>{testResult.result?.percentage}%</strong>. The professional pass mark is <strong>70%</strong>. Don't worry, you can study the chapters and try again!
                </p>
              </div>

              <div className="max-w-md mx-auto grid grid-cols-2 gap-4 text-xs select-none">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <p className="font-bold text-slate-400">Total Correct</p>
                  <p className="text-base font-black text-rose-500 mt-1">
                    {testResult.result?.marks} / {testResult.result?.totalQuestions} Correct
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <p className="font-bold text-slate-400">Score Needed</p>
                  <p className="text-base font-black text-emerald-500 mt-1">
                    18 Correct (70%)
                  </p>
                </div>
              </div>

              <div className="max-w-md mx-auto flex gap-4 pt-2">
                <button
                  onClick={() => navigate(`/courses/${id}`)}
                  className="flex-1 py-3.5 border border-slate-205 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 font-bold rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Review Syllabus
                </button>
                <button
                  onClick={startTest}
                  className="flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-650 hover:opacity-90 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FaRedoAlt className="text-xs" /> Retake Test
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION SUBMIT DIALOG */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="glass-panel max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl animate-scale-in">
            <FaExclamationTriangle className="text-amber-500 text-5xl mx-auto animate-pulse" />
            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">Submit Certification?</h4>
              <p className="text-xs text-slate-455 dark:text-slate-400">Are you sure you want to finish and submit your final assessment? Your scores will be emailed and stored.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-all"
                type="button"
              >
                No, Back to Quiz
              </button>
              <button
                onClick={submitTest}
                className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-indigo-500/10 transition-all"
                type="button"
              >
                Yes, Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CertificateTest;
export { CertificateTest };
