import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import { 
  FaArrowLeft, 
  FaDownload, 
  FaPrint, 
  FaShareAlt, 
  FaAward, 
  FaShieldAlt, 
  FaCheckCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Certificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCourseDetails, fetchQuizHistory, loading: courseLoading } = useCourse();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [passResult, setPassResult] = useState(null);

  useEffect(() => {
    const verifyAndLoad = async () => {
      const details = await fetchCourseDetails(id);
      if (!details) {
        toast.error('Failed to load course details.');
        return navigate('/dashboard');
      }
      setCourse(details);

      const history = await fetchQuizHistory();
      // Look for a passing result for the final certification exam (chapterIndex === -1)
      const passedExam = history.find(r => r.courseId === id && r.chapterIndex === -1 && r.passStatus === true);
      
      if (!passedExam) {
        toast.error('Access denied: You must pass the Certificate Test to unlock your Certificate.');
        return navigate(`/courses/${id}`);
      }
      setPassResult(passedExam);
    };

    if (user) {
      verifyAndLoad();
    }
  }, [id, user]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Certificate sharing link copied to clipboard! 🔗');
  };

  if (courseLoading || !course || !passResult || !user) {
    return <Loader />;
  }

  // Certificate Parameters
  const certificateId = `EQ-${course.courseId.toUpperCase()}-${user._id.slice(-6).toUpperCase()}`;
  const completionDate = new Date(passResult.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=0f172a&data=${encodeURIComponent(
    `${window.location.origin}/courses/${id}/certificate?verify=${certificateId}`
  )}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      
      {/* Print styles override */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          nav, footer, button, .no-print {
            display: none !important;
          }
          .certificate-print-wrap {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .certificate-frame {
            border: 15px solid #1e293b !important;
            width: 100% !important;
            height: 100% !important;
            box-sizing: border-box;
            background-color: #ffffff !important;
          }
        }
      `}</style>

      {/* Header (No-Print) */}
      <div className="flex items-center justify-between border-b border-slate-205 dark:border-slate-800 pb-4 no-print select-none">
        <Link
          to={`/courses/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-650 transition-colors"
        >
          <FaArrowLeft className="text-[10px]" /> Back to Course Overview
        </Link>
        <span className="text-xs font-bold text-slate-400">
          Digital Credential Identification: <span className="text-indigo-650 dark:text-indigo-400 font-extrabold">{certificateId}</span>
        </span>
      </div>

      {/* Control Buttons (No-Print) */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-indigo-50/20 dark:bg-indigo-950/10 p-4 border border-indigo-150 dark:border-indigo-900/30 rounded-2xl no-print select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-755 dark:text-indigo-400">
          <FaCheckCircle className="text-emerald-500 text-sm" />
          <span>Your certificate has been validated and issued!</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <FaShareAlt className="text-indigo-500 text-[10px]" /> Share Credential
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-705 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-md hover:shadow-indigo-500/10 flex items-center gap-1.5 transition-all"
          >
            <FaPrint className="text-[10px]" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* CERTIFICATE DISPLAY BODY */}
      <div className="certificate-print-wrap flex justify-center py-4">
        <div className="certificate-frame w-full max-w-4xl border-[16px] border-slate-900 dark:border-black rounded-3xl bg-white text-slate-900 p-8 md:p-12 relative shadow-2xl flex flex-col justify-between aspect-[1.414/1] box-border text-center select-none overflow-hidden">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-lg"></div>

          {/* Org Logo / Badge Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-indigo-650 font-bold tracking-widest text-sm">
              <FaShieldAlt className="text-amber-500 text-lg" />
              <span>EDUQUIZ GLOBAL ACADEMY</span>
            </div>
            <p className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase">Credential Verification Standard</p>
          </div>

          {/* Certificate Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">
              Certificate of Completion
            </h1>
            <p className="text-xs text-slate-500 italic max-w-md mx-auto leading-relaxed">
              This digital credential certifies that the candidate has completed all required topics, practical sandboxes, and successfully passed the final certification exam.
            </p>
          </div>

          {/* Recipient details */}
          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">This document is proudly presented to</p>
            <h2 className="text-3xl font-extrabold text-indigo-755 border-b-2 border-amber-500 max-w-sm mx-auto pb-1.5 leading-none">
              {user.name}
            </h2>
            <p className="text-xs font-bold text-slate-550 mt-2">
              For completing the syllabus track and passing all assessments for
            </p>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-wide">
              {course.name} Developer Syllabus
            </h3>
          </div>

          {/* Certificate Signatures & QR Code verification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 items-end">
            
            {/* Completion Date */}
            <div className="text-left space-y-1">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Date of Issue</p>
              <p className="text-xs font-bold text-slate-800">{completionDate}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Certificate ID</p>
              <p className="text-xs font-mono font-bold text-slate-655">{certificateId}</p>
            </div>

            {/* Verification QR code */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <img 
                src={qrCodeUrl} 
                alt="Verification QR Code" 
                className="w-20 h-20 border-2 border-slate-100 p-0.5 rounded-lg shadow-sm"
              />
              <span className="text-[8px] font-black text-slate-455 tracking-wider uppercase">Scan to Verify</span>
            </div>

            {/* Signatures */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-xl text-indigo-650 font-semibold border-b border-slate-200 pb-1 max-w-[160px] ml-auto select-none leading-none pr-1">
                A Vance
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Dr. Alistair Vance</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest">Director, EduQuiz Global</p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Certificate;
export { Certificate };
