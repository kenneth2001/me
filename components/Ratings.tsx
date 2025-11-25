import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, Star, ExternalLink, Activity, ArrowUpRight, BarChart3, Clock } from 'lucide-react';
import Section from './Section';

// CSV path
const csvUrl = 'data/rating.csv';

interface RatingItem {
  id: string;
  myRating: number;
  dateRated: string;
  title: string;
  url: string;
  type: string;
  imdbRating: number;
  year: number;
  genres: string[];
  pictureUrl: string;
  director: string;
  runtime: number;
}

// --- 3D Tilt Card Component ---
const TiltCard = ({ children, className, glowColor }: { children: React.ReactNode, className?: string, glowColor: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative w-full h-full ${className}`}
        >
            <div 
                style={{ transform: "translateZ(0px)" }} 
                className={`absolute inset-0 rounded-xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${glowColor} blur-xl`} 
            />
            {children}
        </motion.div>
    );
};

// --- Custom Chart Components ---

const RatingDistributionChart = ({ data }: { data: RatingItem[] }) => {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    const counts = useMemo(() => {
        const c = Array(11).fill(0);
        let max = 0;
        data.forEach(d => {
            const r = Math.round(d.myRating);
            if (r >= 0 && r <= 10) {
                c[r]++;
                if (c[r] > max) max = c[r];
            }
        });
        return { counts: c, max };
    }, [data]);

    return (
        <div 
            className="w-full h-44 flex items-end justify-between gap-1 sm:gap-2 px-2 select-none relative"
            onMouseLeave={() => setHoveredRating(null)}
        >
            {counts.counts.map((count, rating) => {
                if (rating === 0) return null; // Skip 0
                
                // Calculate height percentage relative to container
                // Cap at 75% to leave generous headroom for tooltip and bottom room for label
                const percentage = counts.max > 0 ? (count / counts.max) : 0;
                const barHeightPercent = percentage * 75;
                
                let barColor = 'bg-slate-700';
                if (rating >= 9) barColor = 'bg-neon-green shadow-[0_0_10px_rgba(10,255,0,0.5)]';
                else if (rating >= 8) barColor = 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]';
                else if (rating >= 6) barColor = 'bg-yellow-400';

                const isHovered = hoveredRating === rating;

                return (
                    <div 
                        key={rating} 
                        className="flex-1 flex flex-col items-center justify-end h-full group relative z-10"
                        onMouseEnter={() => setHoveredRating(rating)}
                    >
                         {/* Bar Wrapper - Height is relative to the Max Count, maxing out at 75% of container */}
                         <div 
                            className="w-full flex justify-center relative items-end transition-all duration-300 ease-out"
                            style={{ height: `${Math.max(barHeightPercent, 2)}%` }}
                         >
                             {/* Tooltip - Strictly Top Centered */}
                             <AnimatePresence>
                                 {isHovered && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center z-50 pointer-events-none"
                                    >
                                        <div className="bg-slate-800/95 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded shadow-xl border border-neon-blue/30 whitespace-nowrap min-w-[24px] text-center">
                                            {count}
                                        </div>
                                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-800/95 -mt-[1px]"></div>
                                    </motion.div>
                                 )}
                             </AnimatePresence>

                             {/* Actual Bar */}
                             <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className={`w-full max-w-[20px] rounded-t-sm ${barColor} transition-all duration-200 ${isHovered ? 'opacity-100 brightness-110' : 'opacity-60 group-hover:opacity-80'}`}
                             ></motion.div>
                         </div>
                         
                        {/* Label - Fixed height for perfect baseline alignment */}
                        <div className="h-6 flex items-center justify-center w-full mt-2">
                            <span className={`text-[10px] font-mono transition-colors duration-200 ${isHovered ? 'text-white font-bold scale-110' : 'text-slate-600'}`}>
                                {rating}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- Smoothed Line Helpers ---
const line = (pointA: number[], pointB: number[]) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
};

const controlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
  const p = previous || current;
  const n = next || current;
  const smoothing = 0.15;
  const o = line(p, n);
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;
  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;
  return [x, y];
};

const bezierCommand = (point: number[], i: number, a: number[][]) => {
  const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
  const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
  return `C ${cpsX.toFixed(2)},${cpsY.toFixed(2)} ${cpeX.toFixed(2)},${cpeY.toFixed(2)} ${point[0].toFixed(2)},${point[1].toFixed(2)}`;
};

const svgPath = (points: number[][]) => {
  return points.reduce((acc, point, i, a) => i === 0
    ? `M ${point[0].toFixed(2)},${point[1].toFixed(2)}`
    : `${acc} ${bezierCommand(point, i, a)}`
  , '');
};

const YearDistributionChart = ({ data }: { data: RatingItem[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeX, setActiveX] = useState<number | null>(null);

    const { points, minYear, maxYear, yearMap, maxCount } = useMemo(() => {
        if (data.length === 0) return { points: [], minYear: 0, maxYear: 0, yearMap: {}, maxCount: 0 };
        
        const yearMap: Record<number, number> = {};
        let min = new Date().getFullYear();
        let max = 0;
        let maxCount = 0;

        data.forEach(d => {
            if (d.year && d.year > 1900) {
                yearMap[d.year] = (yearMap[d.year] || 0) + 1;
                if (yearMap[d.year] > maxCount) maxCount = yearMap[d.year];
                if (d.year < min) min = d.year;
                if (d.year > max) max = d.year;
            }
        });
        
        if (min === max) { min -= 1; max += 1; }
        if (max === 0) return { points: [], minYear: 0, maxYear: 0, yearMap: {}, maxCount: 0 };

        const pts: number[][] = [];
        const width = 100;
        const height = 50; 
        const padding = 5;
        const availableHeight = height - padding;

        for (let y = min; y <= max; y++) {
            const count = yearMap[y] || 0;
            const x = ((y - min) / (max - min)) * width;
            // Invert Y because SVG 0 is top
            const yPos = height - ((count / maxCount) * availableHeight);
            pts.push([x, yPos]);
        }
        return { points: pts, minYear: min, maxYear: max, yearMap, maxCount };
    }, [data]);

    const activeData = useMemo(() => {
        if (activeX === null || points.length === 0) return null;
        const index = Math.round((activeX / 100) * (points.length - 1));
        const safeIndex = Math.max(0, Math.min(index, points.length - 1));
        
        const point = points[safeIndex];
        const year = minYear + safeIndex;
        const count = yearMap[year] || 0;
        
        // Logic: If on the left half (<50%), show tooltip to the RIGHT.
        // If on the right half (>=50%), show tooltip to the LEFT.
        const isTooltipRight = point[0] < 50;
        
        return { point, year, count, isTooltipRight };
    }, [activeX, points, minYear, yearMap]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const relativeX = Math.max(0, Math.min(1, x / rect.width)) * 100;
        setActiveX(relativeX);
    };

    if (points.length === 0) return <div className="h-32 flex items-center justify-center text-slate-500 text-xs">No Data</div>;

    const linePath = svgPath(points);
    const areaPath = `${linePath} L 100,60 L 0,60 Z`; 

    return (
        <div 
            className="w-full h-32 relative pt-6 px-2 cursor-crosshair select-none group"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setActiveX(null)}
        >
             <div className="relative w-full h-full overflow-visible">
                 <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="yearGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(188, 19, 254)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="rgb(188, 19, 254)" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    
                    <motion.path 
                        d={areaPath} 
                        fill="url(#yearGradient)" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    
                    <motion.path 
                        d={linePath} 
                        fill="none" 
                        stroke="rgb(188, 19, 254)" 
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Active Point Indicator */}
                    {activeData && (
                        <circle 
                            cx={activeData.point[0]} 
                            cy={activeData.point[1]} 
                            r="3" 
                            className="fill-slate-950 stroke-white stroke-2"
                        />
                    )}
                 </svg>

                 {/* Active Tooltip */}
                 <AnimatePresence>
                    {activeData && (
                         <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.05 }}
                            className="absolute z-20 pointer-events-none flex items-center"
                            style={{ 
                                top: `${(activeData.point[1] / 50) * 100}%`,
                                // If tooltip should be on the right, anchor left to the point.
                                // If tooltip should be on the left, anchor right to (100 - point)%.
                                left: activeData.isTooltipRight ? `${activeData.point[0]}%` : 'auto',
                                right: activeData.isTooltipRight ? 'auto' : `${100 - activeData.point[0]}%`,
                                // Apply pure transform for spacing and centering Y
                                transform: 'translateY(-50%)',
                                marginLeft: activeData.isTooltipRight ? '12px' : 0,
                                marginRight: activeData.isTooltipRight ? 0 : '12px',
                            }}
                         >
                            {/* Arrow for Right-Side Tooltip (attached to left of content) */}
                            {activeData.isTooltipRight && (
                                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-slate-800/95 mr-[-1px]"></div>
                            )}

                            {/* Content Box */}
                            <div className="bg-slate-800/95 backdrop-blur-md border border-neon-purple/30 rounded-lg px-3 py-2 shadow-xl flex flex-col items-start min-w-[70px]">
                                <div className="text-sm font-bold text-white leading-none mb-1">{activeData.year}</div>
                                <div className="text-[10px] text-neon-purple uppercase font-semibold tracking-wide whitespace-nowrap">{activeData.count} titles</div>
                            </div>

                            {/* Arrow for Left-Side Tooltip (attached to right of content) */}
                            {!activeData.isTooltipRight && (
                                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-slate-800/95 ml-[-1px]"></div>
                            )}
                         </motion.div>
                    )}
                 </AnimatePresence>
                 
                 {/* X Axis Labels */}
                 <div className={`absolute bottom-0 left-0 text-[10px] font-mono text-slate-500 translate-y-full pt-2 transition-opacity duration-300 ${activeX && activeX < 15 ? 'opacity-20' : 'opacity-100'}`}>
                     {minYear}
                 </div>
                 <div className={`absolute bottom-0 right-0 text-[10px] font-mono text-slate-500 translate-y-full pt-2 transition-opacity duration-300 ${activeX && activeX > 85 ? 'opacity-20' : 'opacity-100'}`}>
                     {maxYear}
                 </div>
             </div>
        </div>
    );
}

const Ratings: React.FC = () => {
  const [data, setData] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof RatingItem; direction: 'asc' | 'desc' }>({
    key: 'dateRated',
    direction: 'desc'
  });
  const [spotlightItem, setSpotlightItem] = useState<RatingItem | null>(null);

  // CSV Parsing
  const parseCSV = (text: string) => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentField);
        currentField = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField);
          rows.push(currentRow);
          currentRow = [];
          currentField = '';
        }
        if (char === '\r' && nextChar === '\n') i++;
      } else {
        currentField += char;
      }
    }
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField);
      rows.push(currentRow);
    }
    return rows;
  };

  useEffect(() => {
    fetch(csvUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch");
        return response.text();
      })
      .then((text) => {
        const rows = parseCSV(text);
        const parsedData = rows.slice(1).map((row) => ({
          id: row[0],
          myRating: parseInt(row[1]) || 0,
          dateRated: row[2],
          title: row[3],
          url: row[5],
          type: row[6],
          imdbRating: parseFloat(row[7]) || 0,
          runtime: parseInt(row[8]) || 0,
          year: parseInt(row[9]) || 0,
          genres: row[10] ? row[10].split(',').map((g) => g.trim()) : [],
          director: row[13],
          pictureUrl: row[14],
        })).filter(item => item.title);
        
        setData(parsedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading CSV:', error);
        setLoading(false);
      });
  }, []);

  // Compute stats
  const averageRating = useMemo(() => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.myRating, 0);
    return (sum / data.length).toFixed(1);
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(lowerTerm) || 
        item.genres.some(g => g.toLowerCase().includes(lowerTerm))
      );
    }

    if (selectedType !== 'All') {
      result = result.filter(item => 
        selectedType === 'Movie' ? item.type === 'Movie' : item.type !== 'Movie'
      );
    }

    return result.sort((a, b) => {
      // @ts-ignore
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      // @ts-ignore
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, searchTerm, selectedType, sortConfig]);

  useEffect(() => {
    if (filteredData.length > 0 && !spotlightItem) {
        const highRated = filteredData.filter(i => i.myRating >= 8);
        const candidates = highRated.length > 0 ? highRated : filteredData;
        setSpotlightItem(candidates[Math.floor(Math.random() * candidates.length)]);
    }
  }, [data]); // Run once mostly

  const handleSort = (key: keyof RatingItem) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-neon-green';
    if (rating >= 8) return 'text-cyan-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-slate-400';
  };

  const getGlowColor = (rating: number) => {
    if (rating >= 9) return 'bg-neon-green/20';
    if (rating >= 8) return 'bg-cyan-400/20';
    if (rating >= 6) return 'bg-yellow-400/20';
    return 'bg-slate-500/10';
  }

  // Dynamic Grid Span Logic
  const getGridSpanClass = (item: RatingItem) => {
      // 10s are Wide (2x1) to highlight them
      if (item.myRating === 10) {
          return "col-span-1 md:col-span-2 md:row-span-1";
      }
      return "col-span-1 row-span-1";
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden selection:bg-neon-pink/30">
        
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
      <div className="fixed -top-40 -right-40 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow z-0"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none z-0"></div>

      {/* --- CINEMATIC SPOTLIGHT HEADER --- */}
      <AnimatePresence mode="wait">
        {spotlightItem && !loading && (
             <motion.div 
                key={spotlightItem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-[60vh] md:h-[70vh] flex items-end justify-start overflow-hidden border-b border-slate-800"
             >
                {/* Backdrop Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={spotlightItem.pictureUrl} 
                        alt="Spotlight" 
                        className="w-full h-full object-cover object-top opacity-40 blur-md scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-16 md:pb-24">
                    <div className="flex flex-col md:flex-row items-end gap-8">
                         {/* Poster Thumb */}
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="hidden md:block w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-white/10 rotate-3"
                        >
                             <img src={spotlightItem.pictureUrl} className="w-full h-full object-cover" />
                        </motion.div>

                        <div className="flex-1 space-y-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3"
                            >
                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full border bg-black/50 backdrop-blur-md ${getRatingColor(spotlightItem.myRating)} border-current`}>
                                    Featured Pick
                                </span>
                                {spotlightItem.imdbRating > 0 && (
                                     <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                                        <Star size={14} className="fill-current" /> IMDb {spotlightItem.imdbRating}
                                    </span>
                                )}
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight drop-shadow-lg"
                            >
                                {spotlightItem.title}
                            </motion.h1>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap items-center gap-4 text-slate-300 text-sm md:text-base"
                            >
                                <span>{spotlightItem.year}</span>
                                {spotlightItem.runtime > 0 && (
                                    <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                        <span>{Math.floor(spotlightItem.runtime / 60)}h {spotlightItem.runtime % 60}m</span>
                                    </>
                                )}
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                <span className="uppercase tracking-wide">{spotlightItem.genres.slice(0,3).join(' / ')}</span>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-6 mt-6"
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase tracking-widest mb-1">My Score</span>
                                    <div className={`text-5xl font-black ${getRatingColor(spotlightItem.myRating)} drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]`}>
                                        {spotlightItem.myRating}<span className="text-2xl text-slate-500">/10</span>
                                    </div>
                                </div>
                                <div className="w-px h-12 bg-slate-700"></div>
                                <a 
                                    href={spotlightItem.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold backdrop-blur-md transition-all border border-white/10 hover:scale-105"
                                >
                                    View Details <ArrowUpRight size={18} />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
             </motion.div>
        )}

        <Section id="ratings-gallery" className="relative z-10 -mt-10 md:-mt-16">
        
        {/* --- ANALYTICS DASHBOARD --- */}
        {!loading && (
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-16"
             >
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative group">
                    {/* Background Glow Container - overflow hidden to contain the glow, but main card is visible */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                         <div className="absolute -top-20 -right-20 w-60 h-60 bg-neon-blue/10 rounded-full blur-[80px] group-hover:bg-neon-blue/20 transition-colors duration-500"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                         {/* Stats Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="text-neon-blue" />
                                <h3 className="text-xl font-bold text-white">Analytics</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Titles Watched</div>
                                    <div className="text-3xl font-black text-white">{data.length}</div>
                                </div>
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Avg Score</div>
                                    <div className="text-3xl font-black text-neon-purple flex items-baseline gap-1">
                                        {averageRating} <span className="text-xs font-normal text-slate-500">/10</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Dist */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                                <BarChart3 size={16} />
                                <span className="uppercase tracking-wider font-semibold">Score Distribution</span>
                            </div>
                            <RatingDistributionChart data={data} />
                        </div>

                        {/* Year Dist */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                                <Clock size={16} />
                                <span className="uppercase tracking-wider font-semibold">Release Timeline</span>
                            </div>
                            <YearDistributionChart data={data} />
                        </div>
                    </div>
                </div>
             </motion.div>
        )}

        {/* --- CONTROLS BAR --- */}
        <div className="sticky top-20 z-50 mb-12">
            <div className="bg-slate-950/90 backdrop-blur-xl border-y border-white/10 md:border md:rounded-full py-3 px-6 shadow-2xl shadow-black/50 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
                
                {/* Search */}
                <div className="relative w-full md:w-auto md:flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue transition-colors" />
                    <input
                        type="text"
                        className="w-full bg-transparent border-none text-slate-200 placeholder-slate-500 focus:ring-0 text-sm h-10 pl-9 focus:outline-none"
                        placeholder="Filter by title, genre, director..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="w-px h-6 bg-slate-800 hidden md:block"></div>

                {/* Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {['All', 'Movie', 'TV'].map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                selectedType === type 
                                ? 'bg-slate-100 text-slate-900 shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                    
                    <div className="w-px h-6 bg-slate-800 mx-2"></div>
                    
                    <button
                        onClick={() => handleSort('myRating')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                            sortConfig.key === 'myRating'
                            ? 'bg-neon-purple/10 border-neon-purple text-neon-purple'
                            : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                    >
                        Score <ArrowUpRight size={12} className={`transition-transform duration-300 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                        onClick={() => handleSort('dateRated')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                            sortConfig.key === 'dateRated'
                            ? 'bg-neon-blue/10 border-neon-blue text-neon-blue'
                            : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                    >
                        Date <ArrowUpRight size={12} className={`transition-transform duration-300 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </div>

        {/* --- LOADING --- */}
        {loading && (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-2 border-slate-800 border-t-neon-blue rounded-full animate-spin"></div>
            </div>
        )}

        {/* --- DYNAMIC GRID GALLERY --- */}
        {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-dense px-4 pb-20">
                <AnimatePresence mode="popLayout">
                    {filteredData.map((item) => {
                        const spanClass = getGridSpanClass(item);
                        const isWide = spanClass.includes("col-span-2");

                        // Calculate aspect ratio class based on card type to prevent collapse
                        let aspectRatioClass = "aspect-[2/3]"; // Default vertical poster
                        if (isWide) aspectRatioClass = "aspect-[16/9]"; // Wide cinematic

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                key={item.id}
                                className={`group ${spanClass}`}
                            >
                                <TiltCard glowColor={getGlowColor(item.myRating)}>
                                    <div className={`relative w-full h-full rounded-xl overflow-hidden bg-slate-900 border transition-all duration-300 ${item.myRating >= 9 ? 'border-neon-green/30' : 'border-slate-800 group-hover:border-slate-600'} flex flex-col`}>
                                        
                                        {/* Image Section */}
                                        <div className={`relative overflow-hidden ${isWide ? 'h-full absolute inset-0' : `${aspectRatioClass} w-full`}`}>
                                            <img 
                                                src={item.pictureUrl} 
                                                alt={item.title} 
                                                className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${isWide ? 'opacity-40 group-hover:opacity-50' : ''}`}
                                                loading="lazy"
                                            />
                                            
                                            {/* Gradients */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
                                            {isWide && <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>}
                                            
                                            {/* Top Badge */}
                                            <div className="absolute top-3 right-3 flex flex-col items-end gap-1 opacity-100 z-10">
                                                    {item.imdbRating > 0 && (
                                                    <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-yellow-400 flex items-center gap-1 border border-white/5">
                                                        <Star size={8} fill="currentColor" /> {item.imdbRating}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        {/* For Wide cards, content is overlaid. For standard, it's flexed below image but inside card container */}
                                        <div className={`relative p-4 flex flex-col justify-end ${isWide ? 'h-full z-10 pb-6 pl-6' : 'flex-1 border-t border-slate-800/50'}`}>
                                            
                                            {/* Title */}
                                            <h3 className={`font-bold text-white leading-tight mb-1 drop-shadow-md ${isWide ? 'text-xl md:text-2xl line-clamp-2 w-3/4' : 'text-sm line-clamp-2'}`}>
                                                {item.title}
                                            </h3>
                                            
                                            {/* Metadata */}
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-slate-400 mb-2">
                                                <span className="text-slate-300">{item.year}</span>
                                                {!isWide && item.type !== 'Movie' && <span className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">{item.type}</span>}
                                                {item.genres[0] && <span>• {item.genres[0]}</span>}
                                            </div>

                                            {/* Action Bar */}
                                            <div className={`flex items-center justify-between border-t border-white/10 pt-2 mt-auto ${isWide ? 'w-3/4' : ''}`}>
                                                    <a href={item.url} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
                                                    Info <ExternalLink size={10} />
                                                </a>
                                                
                                                {/* The Score */}
                                                <div className="flex items-center gap-2">
                                                    <span className={`${isWide ? 'text-4xl' : 'text-xl'} font-black ${getRatingColor(item.myRating)} drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}>
                                                        {item.myRating}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </TiltCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        )}

        {!loading && filteredData.length === 0 && (
             <div className="text-center py-20">
                <p className="text-slate-500 text-lg">No titles found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedType('All'); }}
                  className="mt-4 text-neon-blue hover:underline"
                >
                  Reset Filters
                </button>
             </div>
        )}

      </Section>
    </div>
  );
};

export default Ratings;