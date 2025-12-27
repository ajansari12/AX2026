import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GTADotMapProps {
  className?: string;
}

interface UrbanDot {
  x: number;
  y: number;
  size: number;
  delay: number;
  opacity: number;
  isCore: boolean;
}

const LAKE_SHORELINE = [
  { x: 0, y: 0.68 },
  { x: 0.08, y: 0.72 },
  { x: 0.15, y: 0.74 },
  { x: 0.22, y: 0.73 },
  { x: 0.28, y: 0.71 },
  { x: 0.34, y: 0.68 },
  { x: 0.40, y: 0.66 },
  { x: 0.46, y: 0.65 },
  { x: 0.50, y: 0.67 },
  { x: 0.52, y: 0.70 },
  { x: 0.54, y: 0.67 },
  { x: 0.58, y: 0.64 },
  { x: 0.64, y: 0.63 },
  { x: 0.70, y: 0.64 },
  { x: 0.76, y: 0.66 },
  { x: 0.82, y: 0.69 },
  { x: 0.88, y: 0.72 },
  { x: 0.94, y: 0.75 },
  { x: 1, y: 0.78 },
];

const GTA_LAND_BOUNDARY = [
  { x: 0, y: 0.68 },
  { x: 0, y: 0.45 },
  { x: 0.02, y: 0.30 },
  { x: 0.08, y: 0.18 },
  { x: 0.18, y: 0.10 },
  { x: 0.32, y: 0.05 },
  { x: 0.50, y: 0.03 },
  { x: 0.68, y: 0.05 },
  { x: 0.82, y: 0.10 },
  { x: 0.92, y: 0.18 },
  { x: 0.98, y: 0.30 },
  { x: 1, y: 0.45 },
  { x: 1, y: 0.78 },
  ...LAKE_SHORELINE.slice().reverse(),
];

const TORONTO_CENTER = { x: 0.52, y: 0.58 };

const URBAN_CENTERS = [
  { x: 0.52, y: 0.58, name: 'Toronto', radius: 0.14, density: 1.0 },
  { x: 0.36, y: 0.56, name: 'Mississauga', radius: 0.09, density: 0.7 },
  { x: 0.30, y: 0.38, name: 'Brampton', radius: 0.08, density: 0.6 },
  { x: 0.46, y: 0.30, name: 'Vaughan', radius: 0.07, density: 0.5 },
  { x: 0.58, y: 0.26, name: 'Richmond Hill', radius: 0.06, density: 0.5 },
  { x: 0.68, y: 0.32, name: 'Markham', radius: 0.07, density: 0.55 },
  { x: 0.72, y: 0.52, name: 'Scarborough', radius: 0.08, density: 0.6 },
  { x: 0.82, y: 0.56, name: 'Pickering', radius: 0.05, density: 0.4 },
  { x: 0.22, y: 0.60, name: 'Oakville', radius: 0.05, density: 0.45 },
  { x: 0.12, y: 0.56, name: 'Burlington', radius: 0.05, density: 0.4 },
];

const HIGHWAYS = [
  [{ x: 0.05, y: 0.50 }, { x: 0.25, y: 0.46 }, { x: 0.50, y: 0.44 }, { x: 0.75, y: 0.46 }, { x: 0.95, y: 0.50 }],
  [{ x: 0.10, y: 0.38 }, { x: 0.30, y: 0.32 }, { x: 0.50, y: 0.30 }, { x: 0.70, y: 0.32 }, { x: 0.88, y: 0.38 }],
  [{ x: 0.05, y: 0.64 }, { x: 0.20, y: 0.58 }, { x: 0.36, y: 0.54 }],
];

function isAboveShoreline(x: number, y: number): boolean {
  for (let i = 0; i < LAKE_SHORELINE.length - 1; i++) {
    const p1 = LAKE_SHORELINE[i];
    const p2 = LAKE_SHORELINE[i + 1];
    if (x >= p1.x && x <= p2.x) {
      const t = (x - p1.x) / (p2.x - p1.x);
      const shoreY = p1.y + t * (p2.y - p1.y);
      return y < shoreY - 0.03;
    }
  }
  return y < 0.65;
}

function getUrbanDensity(x: number, y: number): { density: number; isCore: boolean } {
  let maxDensity = 0;
  let isCore = false;

  for (const center of URBAN_CENTERS) {
    const dist = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
    if (dist < center.radius) {
      const falloff = 1 - (dist / center.radius);
      const d = center.density * falloff * falloff;
      if (d > maxDensity) {
        maxDensity = d;
        isCore = center.name === 'Toronto' && dist < 0.05;
      }
    }
  }

  return { density: maxDensity, isCore };
}

function generateUrbanDots(width: number, height: number): UrbanDot[] {
  const dots: UrbanDot[] = [];
  const gridSize = 28;
  const margin = 20;

  for (let gx = 0; gx < gridSize; gx++) {
    for (let gy = 0; gy < gridSize; gy++) {
      const nx = (gx + 0.5) / gridSize;
      const ny = (gy + 0.5) / gridSize;

      if (!isAboveShoreline(nx, ny)) continue;
      if (nx < 0.02 || nx > 0.98 || ny < 0.05 || ny > 0.62) continue;

      const { density, isCore } = getUrbanDensity(nx, ny);

      if (density > 0.15 || (density > 0.05 && Math.random() < 0.3)) {
        const jitterX = (Math.random() - 0.5) * 0.02;
        const jitterY = (Math.random() - 0.5) * 0.02;
        const x = margin + (nx + jitterX) * (width - margin * 2);
        const y = margin + (ny + jitterY) * (height - margin * 2);

        dots.push({
          x,
          y,
          size: isCore ? 4 + density * 3 : 2 + density * 3,
          delay: Math.random() * 1.5,
          opacity: 0.4 + density * 0.6,
          isCore,
        });
      }
    }
  }

  return dots;
}

function pointsToPath(points: { x: number; y: number }[], width: number, height: number, margin: number): string {
  return points.map((p, i) => {
    const x = margin + p.x * (width - margin * 2);
    const y = margin + p.y * (height - margin * 2);
    return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
  }).join(' ') + ' Z';
}

function shorelineToPath(width: number, height: number, margin: number): string {
  return LAKE_SHORELINE.map((p, i) => {
    const x = margin + p.x * (width - margin * 2);
    const y = margin + p.y * (height - margin * 2);
    return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
  }).join(' ');
}

function highwayToPath(highway: { x: number; y: number }[], width: number, height: number, margin: number): string {
  const filtered = highway.filter(p => isAboveShoreline(p.x, p.y));
  if (filtered.length < 2) return '';

  return filtered.map((p, i) => {
    const x = margin + p.x * (width - margin * 2);
    const y = margin + p.y * (height - margin * 2);
    return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
  }).join(' ');
}

export const GTADotMap: React.FC<GTADotMapProps> = ({ className = '' }) => {
  const width = 450;
  const height = 500;
  const margin = 20;

  const landPath = useMemo(() => pointsToPath(GTA_LAND_BOUNDARY, width, height, margin), []);
  const shorelinePath = useMemo(() => shorelineToPath(width, height, margin), []);
  const highwayPaths = useMemo(() => HIGHWAYS.map(h => highwayToPath(h, width, height, margin)), []);
  const urbanDots = useMemo(() => generateUrbanDots(width, height), []);

  const torontoX = margin + TORONTO_CENTER.x * (width - margin * 2);
  const torontoY = margin + TORONTO_CENTER.y * (height - margin * 2);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lake-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="land-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F3F4F6" stopOpacity="1" />
            <stop offset="100%" stopColor="#E5E7EB" stopOpacity="1" />
          </linearGradient>
          <filter id="beacon-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="land-clip">
            <path d={landPath} />
          </clipPath>
        </defs>

        <rect x="0" y="0" width={width} height={height} fill="#BFDBFE" fillOpacity="0.3" />

        <motion.rect
          x={margin}
          y={margin + 0.63 * (height - margin * 2)}
          width={width - margin * 2}
          height={height - margin - (margin + 0.63 * (height - margin * 2))}
          fill="url(#lake-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.path
          d={landPath}
          fill="url(#land-fill)"
          stroke="#D1D5DB"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.path
          d={shorelinePath}
          fill="none"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <g clipPath="url(#land-clip)">
          {highwayPaths.map((path, i) => (
            path && (
              <motion.path
                key={i}
                d={path}
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="8 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
              />
            )
          ))}

          {urbanDots
            .filter(d => !d.isCore)
            .map((dot, i) => (
              <motion.circle
                key={`dot-${i}`}
                cx={dot.x}
                cy={dot.y}
                r={dot.size}
                fill="#6B7280"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: dot.opacity * 0.7
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.6 + dot.delay * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
        </g>

        <motion.circle
          cx={torontoX}
          cy={torontoY}
          r={40}
          fill="#10B981"
          fillOpacity="0.1"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.2, 0, 0.2]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />

        <motion.circle
          cx={torontoX}
          cy={torontoY}
          r={24}
          fill="#10B981"
          fillOpacity="0.2"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            delay: 0.3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />

        <motion.circle
          cx={torontoX}
          cy={torontoY}
          r={10}
          fill="#10B981"
          filter="url(#beacon-glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.9, 1, 0.9]
          }}
          transition={{
            duration: 1.5,
            delay: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.circle
          cx={torontoX}
          cy={torontoY}
          r={4}
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
        />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none rounded-xl" />
    </div>
  );
};
