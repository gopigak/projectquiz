import React from 'react';
import { FaAward, FaShareAlt, FaPrint } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CertificateCard = ({ result, courseName }) => {
  const { _id, studentName, percentage, createdAt } = result;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const certId = _id ? 'CERT-' + _id.slice(-8).toUpperCase() : 'CERT-' + Math.random().toString(36).substr(2, 8).toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Certificate URL copied to clipboard! 📋');
  };

  // Mock SVG QR Code representing verified link
  const qrCodeSvg = (
    <svg width="64" height="64" viewBox="0 0 29 29" className="bg-white p-1 rounded-md border border-slate-200 shadow-xs shrink-0 select-none">
      <rect x="0" y="0" width="7" height="7" fill="black" />
      <rect x="1" y="1" width="5" height="5" fill="white" />
      <rect x="2" y="2" width="3" height="3" fill="black" />
      
      <rect x="22" y="0" width="7" height="7" fill="black" />
      <rect x="23" y="1" width="5" height="5" fill="white" />
      <rect x="24" y="2" width="3" height="3" fill="black" />
      
      <rect x="0" y="22" width="7" height="7" fill="black" />
      <rect x="1" y="23" width="5" height="5" fill="white" />
      <rect x="2" y="24" width="3" height="3" fill="black" />
      
      <rect x="9" y="1" width="2" height="2" fill="black" />
      <rect x="15" y="0" width="1" height="3" fill="black" />
      <rect x="12" y="4" width="3" height="1" fill="black" />
      <rect x="19" y="3" width="2" height="2" fill="black" />
      <rect x="10" y="8" width="4" height="2" fill="black" />
      <rect x="16" y="9" width="3" height="1" fill="black" />
      <rect x="2" y="10" width="2" height="2" fill="black" />
      <rect x="24" y="9" width="2" height="4" fill="black" />
      
      <rect x="9" y="15" width="3" height="3" fill="black" />
      <rect x="15" y="14" width="2" height="1" fill="black" />
      <rect x="19" y="16" width="3" height="3" fill="black" />
      <rect x="13" y="20" width="2" height="2" fill="black" />
      <rect x="24" y="18" width="4" height="2" fill="black" />
      <rect x="26" y="22" width="2" height="4" fill="black" />
      <rect x="9" y="24" width="4" height="2" fill="black" />
      <rect x="15" y="25" width="2" height="3" fill="black" />
    </svg>
  );

  return (
    <div className="space-y-6">
      
      {/* Outer Border Frame */}
      <div 
        className="printable-certificate glass-panel rounded-3xl p-6 md:p-12 border-8 border-indigo-500/10 dark:border-slate-800 text-center relative overflow-hidden bg-cover bg-white dark:bg-slate-900"
        style={{ minHeight: '480px' }}
      >
        {/* Decorative corner borders */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-indigo-500 rounded-tl-2xl"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-indigo-500 rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-indigo-500 rounded-bl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-indigo-500 rounded-br-2xl"></div>

        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 flex flex-col items-center py-4">
          {/* Top Seal Badge */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-white shadow-lg animate-float">
            <FaAward size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-widest text-slate-800 dark:text-white uppercase font-serif">
              Certificate of Completion
            </h2>
            <p className="text-[10px] md:text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase font-bold">
              VERIFIED ACADEMIC ACHIEVEMENT RECORD
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 italic font-serif">
              This is proudly presented to
            </p>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-905 dark:text-white underline decoration-indigo-500 decoration-wavy underline-offset-8">
              {studentName}
            </h3>
          </div>

          <div className="space-y-1.5 max-w-lg">
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-serif">
              for successfully completing the learning syllabus and passing the final certification exam for the course path
            </p>
            <h4 className="text-lg md:text-xl font-black tracking-wide text-indigo-650 dark:text-indigo-400 uppercase">
              {courseName}
            </h4>
          </div>

          {/* Date, Grade and QR Details */}
          <div className="grid grid-cols-3 gap-4 w-full border-t border-slate-150 dark:border-slate-850 pt-6 items-center">
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{formattedDate}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Date of Issue</p>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-1">
              {qrCodeSvg}
              <p className="text-[8px] text-slate-400 font-mono font-bold uppercase tracking-wider">{certId}</p>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{percentage}% / 100%</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Certification Grade</p>
            </div>
          </div>

          {/* Signature segment */}
          <div className="pt-4 w-full flex justify-center">
            <div className="text-center space-y-1">
              <span className="font-serif italic text-base text-indigo-500 tracking-widest block font-bold">
                EduQuiz Registry
              </span>
              <div className="w-36 h-0.5 bg-slate-200 dark:bg-slate-850 mx-auto"></div>
              <span className="text-[10px] text-slate-405 uppercase tracking-wider font-bold">
                Authorized Signature
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions buttons */}
      <div className="flex justify-center gap-4 non-printable">
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <FaPrint /> Print / Save as PDF
        </button>
        <button
          onClick={handleShare}
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-800"
        >
          <FaShareAlt /> Copy Certificate Link
        </button>
      </div>

    </div>
  );
};

export default CertificateCard;
export { CertificateCard };
