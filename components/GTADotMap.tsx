import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GTADotMapProps {
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  size: number;
  delay: number;
  isCity: boolean;
  isToronto: boolean;
}

const GTA_BOUNDARY = [
  [0.15, 0.25], [0.25, 0.18], [0.35, 0.12], [0.45, 0.08], [0.55, 0.06],
  [0.65, 0.08], [0.75, 0.12], [0.85, 0.18], [0.92, 0.28],
  [0.95, 0.40], [0.92, 0.52], [0.88, 0.60],
  [0.82, 0.68], [0.75, 0.72], [0.68, 0.74], [0.60, 0.75],
  [0.52, 0.76], [0.45, 0.78], [0.38, 0.80], [0.30, 0.78],
  [0.22, 0.74], [0.15, 0.68], [0.10, 0.58], [0.08, 0.48],
  [0.08, 0.38], [0.10, 0.30], [0.15, 0.25]
];

const LAKE_CURVE = [
  [0.20, 0.82], [0.28, 0.88], [0.38, 0.92], [0.50, 0.94],
  [0.62, 0.92], [0.72, 0.88], [0.80, 0.82]
];

const CITY_CENTERS = [
  { x: 0.52, y: 0.58, name: 'Toronto', main: true },
  { x: 0.35, y: 0.52, name: 'Mississauga', main: false },
  { x: 0.30, y: 0.38, name: 'Brampton', main: false },
  { x: 0.45, y: 0.28, name: 'Vaughan', main: false },
  { x: 0.65, y: 0.32, name: 'Markham', main: false },
  { x: 0.72, y: 0.48, name: 'Scarborough', main: false },
  { x: 0.78, y: 0.38, name: 'Pickering', main: false },
  { x: 0.22, y: 0.45, name: 'Oakville', main: false },
];

function isPointInPolygon(x: number, y: number, polygon: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function generateDots(width: number, height: number): Dot[] {
  const dots: Dot[] = [];
  const gridSize = 18;
  const padding = 20;

  for (let gx = 0; gx < gridSize; gx++) {
    for (let gy = 0; gy < gridSize; gy++) {
      const nx = (gx + 0.5) / gridSize;
      const ny = (gy + 0.5) / gridSize;

      const jitterX = (Math.random() - 0.5) * 0.03;
      const jitterY = (Math.random() - 0.5) * 0.03;
      const jx = nx + jitterX;
      const jy = ny + jitterY;

      if (!isPointInPolygon(jx, jy, GTA_BOUNDARY)) continue;

      const x = padding + jx * (width - padding * 2);
      const y = padding + jy * (height - padding * 2);

      let isCity = false;
      let isToronto = false;
      let minDist = Infinity;

      for (const city of CITY_CENTERS) {
        const dist = Math.sqrt(Math.pow(jx - city.x, 2) + Math.pow(jy - city.y, 2));
        if (dist < minDist) minDist = dist;
        if (dist < 0.06) {
          isCity = true;
          if (city.main && dist < 0.03) isToronto = true;
        }
      }

      const baseSize = isToronto ? 6 : isCity ? 4 : 2.5;
      const sizeVariation = Math.random() * 0.5 + 0.75;

      dots.push({
        x,
        y,
        size: baseSize * sizeVariation,
        delay: Math.random() * 2,
        isCity,
        isToronto
      });
    }
  }

  for (const city of CITY_CENTERS) {
    const x = padding + city.x * (width - padding * 2);
    const y = padding + city.y * (height - padding * 2);
    dots.push({
      x,
      y,
      size: city.main ? 10 : 6,
      delay: city.main ? 0 : Math.random() * 0.5,
      isCity: true,
      isToronto: city.main
    });
  }

  return dots;
}

function generateLakeWave(width: number, height: number): string {
  const padding = 20;
  const points = LAKE_CURVE.map(([nx, ny]) => {
    const x = padding + nx * (width - padding * 2);
    const y = padding + ny * (height - padding * 2);
    return `${x},${y}`;
  });
  return `M ${points.join(' L ')}`;
}

export const GTADotMap: React.FC<GTADotMapProps> = ({ className = '' }) => {
  const width = 400;
  const height = 500;

  const dots = useMemo(() => generateDots(width, height), []);
  const lakePath = useMemo(() => generateLakeWave(width, height), []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800" />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow-light" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-dark" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d={lakePath}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 8"
          className="stroke-blue-300/40 dark:stroke-blue-500/30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {dots.map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.size}
            className={
              dot.isToronto
                ? 'fill-emerald-500 dark:fill-emerald-400'
                : dot.isCity
                ? 'fill-gray-600 dark:fill-gray-300'
                : 'fill-gray-400 dark:fill-gray-500'
            }
            filter={dot.isToronto ? 'url(#glow-dark)' : undefined}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, dot.isToronto ? 1.3 : 1.15, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: dot.isToronto ? 2 : 3,
              delay: dot.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        <motion.circle
          cx={dots.find(d => d.isToronto && d.size >= 10)?.x || 220}
          cy={dots.find(d => d.isToronto && d.size >= 10)?.y || 290}
          r={20}
          className="fill-emerald-500/20 dark:fill-emerald-400/20"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.4, 0, 0.4]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-gray-900/60 pointer-events-none" />
    </div>
  );
};
