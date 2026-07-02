import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaPaperPlane, FaPhoneAlt, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '../services/api';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!name.trim() || !email.trim() || !phone.trim() || !subject.trim() || !msg.trim()) {
      return toast.error('Please fill in all required fields.');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error('Please enter a valid email address.');
    }

    // Phone validation (digits and optional symbols: spaces, hyphens, brackets, leading +)
    const phoneRegex = /^[+]?[0-9\s()+-]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      return toast.error('Please enter a valid phone number (minimum 7 digits).');
    }

    setSubmitting(true);
    try {
      const { data } = await API.post('/contact', {
        name,
        email,
        phone,
        subject,
        message: msg
      });

      if (data.success) {
        toast.success('Your message has been received! Our support team will get in touch shortly. ✉️');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMsg('');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit contact message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      
      {/* Header Title */}
      <div className="text-center space-y-3 select-none">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          Contact Us
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Have feedback or need developer support? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Office Contacts Info */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6 text-xs select-none">
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-55/10 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-150">
              <FaEnvelope />
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Email Support</p>
              <p className="text-slate-700 dark:text-slate-200 font-semibold">support@eduquiz.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-violet-55/10 dark:bg-violet-950/40 text-violet-500 flex items-center justify-center shrink-0 border border-violet-150">
              <FaPhoneAlt />
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Call Support</p>
              <p className="text-slate-700 dark:text-slate-200 font-semibold">+1 (555) 902-1240</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-lg bg-pink-55/10 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center shrink-0 border border-pink-150">
              <FaMapMarkerAlt />
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Registry Office</p>
              <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                100 Innovation Way, Suite 400<br />Silicon Valley, CA 94025
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Support Form */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <FaUser className="text-sm" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-hidden focus:border-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <FaEnvelope className="text-sm" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="janesmith@example.com"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-hidden focus:border-indigo-500 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <FaPhoneAlt className="text-xs" />
                  </span>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-hidden focus:border-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inquiry Subject</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <FaTag className="text-xs" />
                  </span>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Account Help or Syllabus feedback"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-hidden focus:border-indigo-500 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Message Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message Description</label>
              <textarea
                required
                rows="4"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Write your support inquiry or platform feedback details here..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-hidden focus:border-indigo-500 dark:text-white leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              {submitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <FaPaperPlane className="text-[10px]" /> Send Inquiry Message
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Contact;
export { Contact };
