import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import ResultCard from '../components/ResultCard';
import CertificateCard from '../components/CertificateCard';
import MotivationCard from '../components/MotivationCard';
import Loader from '../components/Loader';
import { 
  FaGraduationCap, 
  FaChevronDown, 
  FaChevronUp, 
  FaRedoAlt, 
  FaArrowLeft, 
  FaCheck, 
  FaTimes,
  FaFileExcel,
  FaPrint
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const Result = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { quizHistory, fetchQuizHistory, loading } = useCourse();
  const [showReview, setShowReview] = useState(false);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    if (location.state && location.state.resultDetails) {
      const details = location.state.resultDetails;
      setResult(details.result);
      setQuestions(details.questions || []);
      
      if (details.result.percentage >= 80) {
        triggerConfetti();
      }
    } else {
      fetchQuizHistory().then((historyList) => {
        const matches = historyList.filter(q => q.courseId === id);
        if (matches.length > 0) {
          setResult(matches[0]);
          if (matches[0].percentage >= 80) {
            triggerConfetti();
          }
        }
      });
    }
  }, [id, location.state]);

  const triggerConfetti = () => {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 60 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleExportCSV = () => {
    if (!result) return;
    const headers = ['Student Name', 'Course Name', 'Score', 'Percentage', 'Time Taken', 'Status', 'Exam Date'];
    const row = [
      `"${result.studentName}"`,
      `"${result.courseName}"`,
      `"${result.marks}/${result.totalQuestions}"`,
      `"${result.percentage}%"`,
      `"${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s"`,
      result.percentage >= 50 ? 'PASSED' : 'FAILED',
      `"${new Date(result.createdAt).toLocaleDateString()}"`
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eduquiz_result_${result.courseId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Quiz result spreadsheet exported! 📊');
  };

  if (loading && !result) {
    return <Loader />;
  }

  if (!result) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <p className="text-slate-400 text-sm font-semibold italic">No active result found for this course.</p>
        <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Upper header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-855 dark:text-white">
          Certification Result
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          Interactive Assessment Review
        </p>
      </div>

      {/* Main Grid: Result card details and motivation sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <ResultCard result={result} />
        </div>
        <div className="md:col-span-1">
          <MotivationCard percentage={result.percentage} />
        </div>
      </div>

      {/* Conditional Certificate download box (80% threshold required) */}
      {result.percentage >= 80 ? (
        <div className="pt-6 border-t border-slate-100 dark:border-slate-855">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center justify-center gap-1.5">
              🎓 Official Completion Diploma
            </h3>
            <p className="text-xs text-slate-450">Download or print your verified student certificate</p>
          </div>
          <CertificateCard result={result} courseName={result.courseName} />
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-amber-250 bg-amber-50/20 text-xs text-amber-700 dark:text-amber-300 text-center">
          ⚠️ <strong>Certificate Locked:</strong> A score of <strong>80% or higher</strong> is required to earn the official certification diploma. You scored {result.percentage}%.
        </div>
      )}

      {/* Toggle Review Section */}
      {questions.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-850">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full py-3.5 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-855 transition-colors flex justify-between items-center font-bold text-xs text-slate-750 dark:text-slate-200 cursor-pointer"
          >
            <span>REVIEW ASSESSMENT QUESTIONS ({questions.length})</span>
            {showReview ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {showReview && (
            <div className="space-y-4 animate-fade-in">
              {questions.map((q, idx) => {
                const isCorrect = userAnswers[String(idx)] !== undefined
                  ? userAnswers[String(idx)] === q.correctAnswer
                  : false;

                return (
                  <div 
                    key={q._id || idx}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-4"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-indigo-500">Question {idx + 1}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400">
                        {q.difficulty}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-normal">
                      {q.questionText}
                    </h4>

                    {/* Options list showing answers */}
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isCorrectOption = oIdx === q.correctAnswer;
                        
                        let optBorder = 'border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-slate-655 dark:text-slate-350';
                        if (isCorrectOption) {
                          optBorder = 'border-emerald-500 bg-emerald-50/25 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-350 font-bold';
                        }

                        return (
                          <div 
                            key={oIdx}
                            className={`p-3 rounded-xl border text-xs flex justify-between items-center ${optBorder}`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {isCorrectOption && <FaCheck className="text-emerald-500" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 dark:text-slate-400 border-l-2 border-indigo-500 leading-relaxed">
                        <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">Explanation:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Redirections and report builders */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 pb-12 non-printable select-none">
        <button
          onClick={handleExportCSV}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <FaFileExcel /> Export Excel (CSV)
        </button>

        <button
          onClick={() => window.print()}
          className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-250 dark:border-slate-800 cursor-pointer"
        >
          <FaPrint /> Print Report
        </button>

        <button
          onClick={() => navigate(`/courses/${id}/quiz`)}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <FaRedoAlt /> Retry Test
        </button>

        <Link
          to="/dashboard"
          className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 flex items-center gap-1.5"
        >
          <FaArrowLeft /> Go to Dashboard
        </Link>
      </div>

    </div>
  );
};

export default Result;
export { Result };
