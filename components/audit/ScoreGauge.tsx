import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  delay?: number;
}

function getScoreColor(score: number): { stroke: string; bg: string; text: string } {
  if (score >= 90) return { stroke: '#16a34a', bg: 'rgba(22,163,74,0.1)', text: 'text-green-600 dark:text-green-400' };
  if (score >= 50) return { stroke: '#d97706', bg: 'rgba(217,119,6,0.1)', text: 'text-amber-600 dark:text-amber-400' };
  return { stroke: '#dc2626', bg: 'rgba(220,38,38,0.1)', text: 'text-red-600 dark:text-red-400' };
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, size = 100, delay = 0 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const colors = getScoreColor(score);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const step = score / 40;
      const interval = setInterval(() => {
        current += step;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, 20);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [score, delay]);

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${colors.text}`}>{animatedScore}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center leading-tight">
        {label}
      </span>
    </motion.div>
  );
};
