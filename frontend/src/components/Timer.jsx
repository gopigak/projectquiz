import React, { useState, useEffect } from 'react';
import { FaRegClock } from 'react-icons/fa';

const Timer = ({ duration, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCritical = timeLeft < 60; // critical warning color if under 60 seconds

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm transition-all ${
        isCritical
          ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/25 dark:border-rose-900/40 dark:text-rose-400 animate-pulse'
          : 'bg-indigo-50 border-indigo-150 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400'
      }`}
    >
      <FaRegClock className={isCritical ? 'animate-spin' : ''} />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
export { Timer };
