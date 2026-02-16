import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

interface CountdownTimerProps {
  targetDate: Date | Timestamp | string | number | null;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState('Calculating...');

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      let target: number;

      if (targetDate instanceof Timestamp) {
        target = targetDate.toMillis();
      } else if (targetDate instanceof Date) {
        target = targetDate.getTime();
      } else {
        target = new Date(targetDate).getTime();
      }

      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft('00:00');
        clearInterval(interval);
        if (onComplete) onComplete();
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return <span className="font-mono tabular-nums">{timeLeft}</span>;
};

export default CountdownTimer;
