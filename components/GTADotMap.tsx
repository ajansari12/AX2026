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
  opacity: number;
  type: 'city' | 'urban' | 'suburban' | 'highway' | 'toronto';
}

const LAKE_ONTARIO_SHORELINE = [
  { x: 0.05, y: 0.72 },
  { x: 0.10, y: 0.74 },
  { x: 0.15, y: 0.75 },
  { x: 0.20, y: 0.74 },
  { x: 0.25, y: 0.72 },
  { x: 0.30, y: 0.70 },
  { x: 0.35, y: 0.68 },
  { x: 0.40, y: 0.67 },
  { x: 0.45, y: 0.66 },
  { x: 0.48, y: 0.68 },
  { x: 0.50, y: 0.70 },
  { x: 0.52, y: 0.68 },
  { x: 0.55, y: 0.66 },
  { x: 0.60, y: 0.65 },
  { x: 0.65, y: 0.66 },
  { x: 0.70, y: 0.68 },
  { x: 0.75, y: 0.70 },
  { x: 0.80, y: 0.72 },
  { x: 0.85, y: 0.74 },
  { x: 0.90, y: 0.76 },
  { x: 0.95, y: 0.78 },
];

const GTA_BOUNDARY = [
  { x: 0.05, y: 0.72 },
  { x: 0.03, y: 0.55 },
  { x: 0.05, y: 0.40 },
  { x: 0.10, y: 0.25 },
  { x: 0.20, y: 0.15 },
  { x: 0.35, y: 0.08 },
  { x: 0.50, y: 0.05 },
  { x: 0.65, y: 0.08 },
  { x: 0.80, y: 0.15 },
  { x: 0.90, y: 0.25 },
  { x: 0.95, y: 0.40 },
  { x: 0.97, y: 0.55 },
  { x: 0.95, y: 0.78 },
  ...LAKE_ONTARIO_SHORELINE.slice().reverse(),
];

const CITIES = [
  { x: 0.50, y: 0.62, name: 'Toronto', isToronto: true, radius: 0.12 },
  { x: 0.35, y: 0.58, name: 'Mississauga', isToronto: false, radius: 0.08 },
  { x: 0.30, y: 0.40, name: 'Brampton', isToronto: false, radius: 0.07 },
  { x: 0.45, y: 0.32, name: 'Vaughan', isToronto: false, radius: 0.06 },
  { x: 0.55, y: 0.28, name: 'Richmond Hill', isToronto: false, radius: 0.05 },
  { x: 0.65, y: 0.35, name: 'Markham', isToronto: false, radius: 0.06 },
  { x: 0.70, y: 0.55, name: 'Scarborough', isToronto: false, radius: 0.07 },
  { x: 0.80, y: 0.58, name: 'Pickering', isToronto: false, radius: 0.05 },
  { x: 0.88, y: 0.62, name: 'Ajax', isToronto: false, radius: 0.04 },
  { x: 0.22, y: 0.62, name: 'Oakville', isToronto: false, radius: 0.05 },
  { x: 0.12, y: 0.58, name: 'Burlington', isToronto: false, radius: 0.05 },
  { x: 0.50, y: 0.18, name: 'Newmarket', isToronto: false, radius: 0.04 },
];

const HIGHWAYS = {
  highway401: [
    { x: 0.05, y: 0.52 },
    { x: 0.15, y: 0.50 },
    { x: 0.25, y: 0.48 },
    { x: 0.35, y: 0.47 },
    { x: 0.45, y: 0.46 },
    { x: 0.55, y: 0.46 },
    { x: 0.65, y: 0.47 },
    { x: 0.75, y: 0.48 },
    { x: 0.85, y: 0.50 },
    { x: 0.95, y: 0.52 },
  ],
  highway407: [
    { x: 0.08, y: 0.42 },
    { x: 0.18, y: 0.38 },
    { x: 0.28, y: 0.35 },
    { x: 0.38, y: 0.33 },
    { x: 0.48, y: 0.32 },
    { x: 0.58, y: 0.32 },
    { x: 0.68, y: 0.34 },
    { x: 0.78, y: 0.38 },
    { x: 0.88, y: 0.42 },
  ],
  qew: [
    { x: 0.05, y: 0.68 },
    { x: 0.12, y: 0.64 },
    { x: 0.20, y: 0.60 },
    { x: 0.28, y: 0.58 },
    { x: 0.36, y: 0.56 },
    { x: 0.44, y: 0.55 },
  ],
  dvp: [
    { x: 0.52, y: 0.62 },
    { x: 0.53, y: 0.55 },
    { x: 0.54, y: 0.48 },
    { x: 0.55, y: 0.42 },
  ],
  gardiner: [
    { x: 0.38, y: 0.60 },
    { x: 0.44, y: 0.62 },
    { x: 0.50, y: 0.63 },
    { x: 0.56, y: 0.62 },
    { x: 0.62, y: 0.60 },
  ],
};

function isPointInPolygon(x: number, y: number): boolean {
  const polygon = GTA_BOUNDARY;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function isAboveLake(x: number, y: number): boolean {
  for (let i = 0; i < LAKE_ONTARIO_SHORELINE.length - 1; i++) {
    const p1 = LAKE_ONTARIO_SHORELINE[i];
    const p2 = LAKE_ONTARIO_SHORELINE[i + 1];
    if (x >= p1.x && x <= p2.x) {
      const t = (x - p1.x) / (p2.x - p1.x);
      const lakeY = p1.y + t * (p2.y - p1.y);
      return y < lakeY - 0.02;
    }
  }
  return y < 0.70;
}

function getUrbanDensity(x: number, y: number): number {
  let maxDensity = 0;
  for (const city of CITIES) {
    const dist = Math.sqrt(Math.pow(x - city.x, 2) + Math.pow(y - city.y, 2));
    if (dist < city.radius) {
      const density = city.isToronto ? 1.0 : 0.7;
      const falloff = 1 - (dist / city.radius);
      maxDensity = Math.max(maxDensity, density * falloff);
    }
  }
  return maxDensity;
}

function generateDots(width: number, height: number): Dot[] {
  const dots: Dot[] = [];
  const padding = 15;

  const urbanGridSize = 35;
  for (let gx = 0; gx < urbanGridSize; gx++) {
    for (let gy = 0; gy < urbanGridSize; gy++) {
      const nx = (gx + 0.5) / urbanGridSize;
      const ny = (gy + 0.5) / urbanGridSize;

      if (!isPointInPolygon(nx, ny) || !isAboveLake(nx, ny)) continue;

      const density = getUrbanDensity(nx, ny);

      if (density > 0.1) {
        const jitterX = (Math.random() - 0.5) * 0.015;
        const jitterY = (Math.random() - 0.5) * 0.015;
        const x = padding + (nx + jitterX) * (width - padding * 2);
        const y = padding + (ny + jitterY) * (height - padding * 2);

        const isToronto = CITIES.find(c => c.isToronto &&
          Math.sqrt(Math.pow(nx - c.x, 2) + Math.pow(ny - c.y, 2)) < 0.04);

        dots.push({
          x, y,
          size: isToronto ? 4 + density * 2 : 2 + density * 2.5,
          delay: Math.random() * 2,
          opacity: 0.5 + density * 0.5,
          type: isToronto ? 'toronto' : density > 0.5 ? 'urban' : 'suburban'
        });
      } else if (Math.random() < 0.15) {
        const x = padding + nx * (width - padding * 2);
        const y = padding + ny * (height - padding * 2);
        dots.push({
          x, y,
          size: 1.5 + Math.random() * 1,
          delay: Math.random() * 3,
          opacity: 0.3 + Math.random() * 0.2,
          type: 'suburban'
        });
      }
    }
  }

  for (const city of CITIES) {
    if (!isAboveLake(city.x, city.y)) continue;
    const x = padding + city.x * (width - padding * 2);
    const y = padding + city.y * (height - padding * 2);
    dots.push({
      x, y,
      size: city.isToronto ? 12 : 6,
      delay: city.isToronto ? 0 : Math.random() * 0.5,
      opacity: 1,
      type: city.isToronto ? 'toronto' : 'city'
    });
  }

  Object.values(HIGHWAYS).forEach((highway) => {
    highway.forEach((point, index) => {
      if (!isAboveLake(point.x, point.y)) return;
      const x = padding + point.x * (width - padding * 2);
      const y = padding + point.y * (height - padding * 2);
      dots.push({
        x, y,
        size: 2,
        delay: index * 0.1,
        opacity: 0.6,
        type: 'highway'
      });
    });
  });

  return dots;
}

function generateShorelinePath(width: number, height: number): string {
  const padding = 15;
  const points = LAKE_ONTARIO_SHORELINE.map((p, i) => {
    const x = padding + p.x * (width - padding * 2);
    const y = padding + p.y * (height - padding * 2);
    return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
  });
  return points.join(' ');
}

function generateHighwayPath(highway: {x: number; y: number}[], width: number, height: number): string {
  const padding = 15;
  const validPoints = highway.filter(p => isAboveLake(p.x, p.y));
  if (validPoints.length < 2) return '';

  const points = validPoints.map((p, i) => {
    const x = padding + p.x * (width - padding * 2);
    const y = padding + p.y * (height - padding * 2);
    return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
  });
  return points.join(' ');
}

export const GTADotMap: React.FC<GTADotMapProps> = ({ className = '' }) => {
  const width = 450;
  const height = 500;

  const dots = useMemo(() => generateDots(width, height), []);
  const shorelinePath = useMemo(() => generateShorelinePath(width, height), []);
  const highwayPaths = useMemo(() => ({
    h401: generateHighwayPath(HIGHWAYS.highway401, width, height),
    h407: generateHighwayPath(HIGHWAYS.highway407, width, height),
    qew: generateHighwayPath(HIGHWAYS.qew, width, height),
    dvp: generateHighwayPath(HIGHWAYS.dvp, width, height),
    gardiner: generateHighwayPath(HIGHWAYS.gardiner, width, height),
  }), []);

  const torontoDot = dots.find(d => d.type === 'toronto' && d.size >= 10);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl" />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="toronto-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lake-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <motion.path
          d={shorelinePath}
          fill="none"
          stroke="url(#lake-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <motion.path
          d={shorelinePath}
          fill="none"
          className="stroke-blue-400/20 dark:stroke-blue-500/20"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {Object.entries(highwayPaths).map(([key, path]) => (
          path && (
            <motion.path
              key={key}
              d={path}
              fill="none"
              className="stroke-gray-300/50 dark:stroke-gray-600/40"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          )
        ))}

        {dots
          .filter(d => d.type === 'suburban')
          .map((dot, i) => (
            <motion.circle
              key={`suburban-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.size}
              className="fill-gray-300 dark:fill-gray-600"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: dot.opacity }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.01 }}
            />
          ))}

        {dots
          .filter(d => d.type === 'urban')
          .map((dot, i) => (
            <motion.circle
              key={`urban-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.size}
              className="fill-gray-500 dark:fill-gray-400"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [dot.opacity * 0.8, dot.opacity, dot.opacity * 0.8]
              }}
              transition={{
                duration: 3,
                delay: dot.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

        {dots
          .filter(d => d.type === 'city')
          .map((dot, i) => (
            <motion.circle
              key={`city-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.size}
              className="fill-gray-700 dark:fill-gray-300"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2.5,
                delay: dot.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

        {dots
          .filter(d => d.type === 'toronto')
          .map((dot, i) => (
            <motion.circle
              key={`toronto-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.size}
              className="fill-emerald-500 dark:fill-emerald-400"
              filter="url(#toronto-glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                delay: dot.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

        {torontoDot && (
          <>
            <motion.circle
              cx={torontoDot.x}
              cy={torontoDot.y}
              r={25}
              className="fill-emerald-500/15 dark:fill-emerald-400/15"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.circle
              cx={torontoDot.x}
              cy={torontoDot.y}
              r={18}
              className="fill-emerald-500/25 dark:fill-emerald-400/25"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                delay: 0.3,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </>
        )}

        {dots
          .filter(d => d.type === 'highway')
          .map((dot, i) => (
            <motion.circle
              key={`highway-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.size}
              className="fill-gray-400/60 dark:fill-gray-500/60"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: dot.opacity }}
              transition={{ duration: 0.3, delay: 1 + dot.delay }}
            />
          ))}
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent dark:from-gray-900/50 pointer-events-none rounded-xl" />
    </div>
  );
};
