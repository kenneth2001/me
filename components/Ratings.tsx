import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, Star, ExternalLink, Activity, ArrowUpRight, BarChart3, Filter, X, User } from 'lucide-react';
import Section from './Section';

// CSV path
const csvUrl = 'data/rating.csv';

interface RatingItem {
  id: string;
  myRating: number;
  dateRated: string;
  releaseDate: string; // Added release date
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

// --- Theme Helper ---
const getRatingTheme = (rating: number) => {
  const r = Math.round(rating);
  switch (r) {
    case 10: return {
      text: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500',
      gradient: 'bg-gradient-to-t from-fuchsia-900 to-fuchsia-500',
      activeGradient: 'bg-gradient-to-t from-fuchsia-800 to-fuchsia-400',
      glow: 'bg-fuchsia-500/30'
    };
    case 9: return {
      text: 'text-violet-400',
      bg: 'bg-violet-500',
      gradient: 'bg-gradient-to-t from-violet-900 to-violet-500',
      activeGradient: 'bg-gradient-to-t from-violet-800 to-violet-400',
      glow: 'bg-violet-500/30'
    };
    case 8: return {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500',
      gradient: 'bg-gradient-to-t from-indigo-900 to-indigo-500',
      activeGradient: 'bg-gradient-to-t from-indigo-800 to-indigo-400',
      glow: 'bg-indigo-500/30'
    };
    case 7: return {
      text: 'text-blue-400',
      bg: 'bg-blue-500',
      gradient: 'bg-gradient-to-t from-blue-900 to-blue-500',
      activeGradient: 'bg-gradient-to-t from-blue-800 to-blue-400',
      glow: 'bg-blue-500/30'
    };
    case 6: return {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500',
      gradient: 'bg-gradient-to-t from-cyan-900 to-cyan-500',
      activeGradient: 'bg-gradient-to-t from-cyan-800 to-cyan-400',
      glow: 'bg-cyan-500/30'
    };
    case 5: return {
      text: 'text-teal-400',
      bg: 'bg-teal-500',
      gradient: 'bg-gradient-to-t from-teal-900 to-teal-500',
      activeGradient: 'bg-gradient-to-t from-teal-800 to-teal-400',
      glow: 'bg-teal-500/30'
    };
    case 4: return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
      gradient: 'bg-gradient-to-t from-emerald-900 to-emerald-500',
      activeGradient: 'bg-gradient-to-t from-emerald-800 to-emerald-400',
      glow: 'bg-emerald-500/30'
    };
    case 3: return {
      text: 'text-yellow-400',
      bg: 'bg-yellow-500',
      gradient: 'bg-gradient-to-t from-yellow-900 to-yellow-500',
      activeGradient: 'bg-gradient-to-t from-yellow-800 to-yellow-400',
      glow: 'bg-yellow-500/30'
    };
    case 2: return {
      text: 'text-orange-400',
      bg: 'bg-orange-500',
      gradient: 'bg-gradient-to-t from-orange-900 to-orange-500',
      activeGradient: 'bg-gradient-to-t from-orange-800 to-orange-400',
      glow: 'bg-orange-500/30'
    };
    case 1: 
    default: return {
      text: 'text-red-400',
      bg: 'bg-red-500',
      gradient: 'bg-gradient-to-t from-red-900 to-red-500',
      activeGradient: 'bg-gradient-to-t from-red-800 to-red-400',
      glow: 'bg-red-500/30'
    };
  }
};

// --- 3D Tilt Card Component ---
const TiltCard = ({ children, className, glowColor }: { children?: React.ReactNode, className?: string, glowColor: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-3deg", "3deg"]);

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
                className={`absolute inset-0 rounded-xl transition-opacity duration-500 opacity-0 group-hover:opacity-40 ${glowColor} blur-2xl -z-10`} 
            />
            {children}
        </motion.div>
    );
};

// --- Custom Chart Components ---

const RatingDistributionChart = ({ data }: { data: RatingItem[] }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const counts = useMemo(() => {
        const c = Array(11).fill(0);
        let max = 0;
        data.forEach(d => {
            const r = Math.round(d.myRating);
            if (r >= 1 && r <= 10) {
                c[r]++;
                if (c[r] > max) max = c[r];
            }
        });
        return { counts: c, max };
    }, [data]);

    return (
        <div className="w-full flex flex-col h-40 md:h-48 select-none">
            {/* Chart Area */}
            <div className="flex-1 relative border-b border-slate-800/50 flex items-end gap-1.5 md:gap-2 pb-0">
                 {/* Background Grid Lines */}
                 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0 py-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-full h-px bg-slate-700 border-dashed"></div>
                    ))}
                 </div>

                 {counts.counts.map((count, rating) => {
                     if (rating === 0) return null; // Skip 0

                     const percentage = counts.max > 0 ? (count / counts.max) * 100 : 0;
                     const isHovered = hoveredIndex === rating;
                     const theme = getRatingTheme(rating);

                     return (
                         <div 
                            key={rating} 
                            className="flex-1 h-full flex flex-col justify-end group relative z-10 cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(rating)}
                            onMouseLeave={() => setHoveredIndex(null)}
                         >
                             {/* The Bar Container */}
                             <div className="w-full h-full flex flex-col justify-end">
                                 {/* Tooltip Label - Layout based, not absolute */}
                                 <div 
                                    className={`w-full flex justify-center mb-0 transition-all duration-200 origin-bottom ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0 h-0 overflow-hidden'}`}
                                 >
                                    <div className="relative">
                                        <div className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 shadow-xl whitespace-nowrap`}>
                                            {count}
                                        </div>
                                         {/* Tiny arrow pointing down */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[0.5px] border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-slate-800"></div>
                                    </div>
                                 </div>
                                 
                                 {/* The Bar */}
                                 <div 
                                    className={`w-full rounded-t-sm transition-all duration-300 ${isHovered ? theme.activeGradient : theme.gradient} ${isHovered ? 'shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'opacity-80'}`}
                                    style={{ height: `${Math.max(percentage * 0.75, 2)}%` }} // Scale max height to 75% container
                                 ></div>
                             </div>
                         </div>
                     );
                 })}
            </div>

            {/* X-Axis Labels */}
            <div className="h-6 flex items-center gap-1.5 md:gap-2 pt-2">
                {counts.counts.map((_, rating) => {
                    if (rating === 0) return null;
                    const isHovered = hoveredIndex === rating;
                    const theme = getRatingTheme(rating);
                    
                    let axisClass = "text-slate-600";
                    if (isHovered) {
                        axisClass = `${theme.text} font-bold scale-110`;
                    }

                    return (
                        <div key={rating} className={`flex-1 text-center text-[9px] md:text-[10px] font-mono transition-all duration-200 ${axisClass}`}>
                            {rating}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Ratings: React.FC = () => {
  const [data, setData] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof RatingItem; direction: 'asc' | 'desc' }>({
    key: 'myRating',
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
          releaseDate: row[12], // Index 12 is Release Date from CSV
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
                // Reduced height on mobile to be less overwhelming
                className="relative w-full min-h-[300px] md:min-h-[450px] md:h-[50vh] max-h-[600px] flex items-end justify-start overflow-hidden border-b border-slate-800"
             >
                {/* Backdrop Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={spotlightItem.pictureUrl} 
                        alt={spotlightItem.title} 
                        className="w-full h-full object-cover object-top opacity-30 blur-[2px] scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pb-6 md:pb-16">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-8">
                         {/* Poster Thumb - Hidden on Mobile to save space */}
                        <motion.div 
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="hidden md:block w-36 lg:w-40 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-black/80 border border-white/10 shrink-0"
                        >
                             <img src={spotlightItem.pictureUrl} className="w-full h-full object-cover" />
                        </motion.div>

                        <div className="flex-1 space-y-2 md:space-y-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3"
                            >
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border bg-black/40 backdrop-blur-md ${getRatingTheme(spotlightItem.myRating).text} border-white/10`}>
                                    Spotlight
                                </span>
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-2xl md:text-5xl lg:text-6xl font-black text-white leading-tight md:leading-none tracking-tight drop-shadow-lg max-w-3xl"
                            >
                                {spotlightItem.title}
                            </motion.h1>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap items-center gap-3 md:gap-4 text-slate-300 text-xs md:text-sm"
                            >
                                <span className="text-white font-medium">{spotlightItem.year}</span>
                                {spotlightItem.runtime > 0 && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                                        <span>{Math.floor(spotlightItem.runtime / 60)}h {spotlightItem.runtime % 60}m</span>
                                    </>
                                )}
                                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                                <span className="uppercase tracking-wide text-xs">{spotlightItem.genres.slice(0,3).join(' / ')}</span>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 md:mt-6"
                            >
                                <div className="flex items-center gap-3 bg-white/5 px-3 md:px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                    <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-semibold">My Rating</span>
                                    <div className={`text-xl md:text-2xl font-black ${getRatingTheme(spotlightItem.myRating).text}`}>
                                        {spotlightItem.myRating}<span className="text-sm text-slate-500 font-medium">/10</span>
                                    </div>
                                </div>
                                
                                <a 
                                    href={spotlightItem.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-neon-purple/90 hover:bg-neon-purple text-white rounded-lg font-semibold shadow-lg shadow-neon-purple/20 transition-all hover:scale-105 text-xs md:text-sm"
                                >
                                    Details <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
             </motion.div>
        )}

        <Section id="ratings-gallery" className="relative z-10 -mt-6 md:-mt-16">
        
        {/* --- ANALYTICS DASHBOARD --- */}
        {!loading && (
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-12 md:mb-16 px-0 md:px-4"
             >
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 md:rounded-xl p-4 md:p-8 shadow-2xl relative">
                    {/* Separate overflow container for background effects to allow tooltips to overflow */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
                         {/* Background glow effects can go here if needed */}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
                         {/* Stats Column */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="text-neon-blue" />
                                <h3 className="text-lg font-bold text-white tracking-wide">Overview</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/50">
                                    <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1 font-bold">Titles Watched</div>
                                    <div className="text-2xl font-black text-white">{data.length}</div>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/50">
                                    <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1 font-bold">Avg Score</div>
                                    <div className="text-2xl font-black text-neon-blue flex items-baseline gap-1">
                                        {averageRating} <span className="text-xs font-normal text-slate-500">/10</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Dist - Force full width on Tablet/Mobile to prevent squishing */}
                        <div className="">
                            <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                                <BarChart3 size={16} />
                                <span className="uppercase tracking-wider font-bold text-xs">Score Distribution</span>
                            </div>
                            <RatingDistributionChart data={data} />
                        </div>
                    </div>
                </div>
             </motion.div>
        )}

        {/* --- CONTROLS BAR --- */}
        <div className="sticky top-16 md:top-20 z-40 mb-8 pointer-events-none px-2 md:px-0">
            <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/50 rounded-lg md:rounded-xl py-2 md:py-3 px-3 md:px-4 shadow-2xl max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 pointer-events-auto">
                
                {/* Search */}
                <div className="relative w-full md:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-1 focus:ring-neon-blue focus:border-neon-blue text-sm h-9 pl-9 focus:outline-none transition-all"
                        placeholder="Search titles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        {['All', 'Movie', 'TV'].map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                    selectedType === type 
                                    ? 'bg-slate-700 text-white shadow-sm' 
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    
                    <div className="w-px h-5 bg-slate-800 mx-2 hidden md:block"></div>
                    
                    <div className="flex gap-2">
                         <button
                            onClick={() => handleSort('myRating')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border ${
                                sortConfig.key === 'myRating'
                                ? 'bg-slate-800 border-slate-700 text-white'
                                : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-slate-900'
                            }`}
                        >
                            Score <ArrowUpRight size={12} className={`transition-transform duration-300 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                            onClick={() => handleSort('releaseDate')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border ${
                                sortConfig.key === 'releaseDate'
                                ? 'bg-slate-800 border-slate-700 text-white'
                                : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-slate-900'
                            }`}
                        >
                            Release <ArrowUpRight size={12} className={`transition-transform duration-300 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- LOADING --- */}
        {loading && (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-slate-800 border-t-neon-blue rounded-full animate-spin"></div>
            </div>
        )}

        {/* --- DYNAMIC GRID GALLERY --- */}
        {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6 px-4 pb-20 max-w-7xl mx-auto">
                <AnimatePresence mode="popLayout">
                    {filteredData.map((item) => {
                        const theme = getRatingTheme(item.myRating);
                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ 
                                    layout: { type: "spring", stiffness: 100, damping: 20 },
                                    opacity: { duration: 0.2 }
                                }}
                                key={item.id}
                                className="group col-span-1"
                            >
                                <TiltCard glowColor={theme.glow}>
                                    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-800 group-hover:border-slate-600/50 overflow-hidden transition-colors duration-300 shadow-xl shadow-black/50">
                                        
                                        {/* Card Top: Poster & Badge */}
                                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                                            {/* Poster Image */}
                                            <img 
                                                src={item.pictureUrl} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            
                                            {/* My Rating Badge (Top Left Overlay) - Updated for clarity with ICON */}
                                            <div className="absolute top-2 left-2 z-10">
                                                <div className="flex items-center bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-full shadow-lg p-1 pr-2.5">
                                                    <div className={`flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full ${theme.bg} text-white mr-1.5 shadow-inner`}>
                                                        <User size={12} strokeWidth={3} />
                                                    </div>
                                                    <span className={`text-sm md:text-base font-black text-white`}>{item.myRating}</span>
                                                </div>
                                            </div>

                                            {/* Dark Overlay on Hover for Details */}
                                            <a 
                                                href={item.url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center z-20"
                                            >
                                                <p className="text-slate-300 text-xs font-medium mb-3 line-clamp-3">{item.genres.join(', ')}</p>
                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-slate-950 rounded-full text-[10px] font-bold hover:scale-105 transition-transform">
                                                    View IMDb <ExternalLink size={10} />
                                                </span>
                                            </a>
                                        </div>

                                        {/* Card Bottom: Footer Info */}
                                        <div className="p-3 flex flex-col justify-between flex-1 gap-2 bg-slate-900">
                                            
                                            <h3 className="text-xs md:text-sm font-bold text-slate-100 leading-tight line-clamp-2" title={item.title}>
                                                {item.title}
                                            </h3>
                                            
                                            <div className="flex items-center justify-between border-t border-slate-800 pt-2 mt-auto">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">{item.year}</span>
                                                    <span className="text-[9px] text-slate-400 font-medium">{item.type.replace(' Series', '').replace(' Mini', '')}</span>
                                                </div>
                                                
                                                {/* IMDb Score - Updated for clarity */}
                                                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800" title="IMDb Rating">
                                                     <div className="bg-[#f5c518] text-black text-[9px] font-black px-1 rounded-[2px] leading-tight">IMDb</div>
                                                     <div className="flex items-center gap-1">
                                                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                                        <span className="text-[10px] font-bold text-slate-300">{item.imdbRating > 0 ? item.imdbRating : '-'}</span>
                                                     </div>
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-slate-800 mb-4">
                    <Filter className="text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No matches found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">We couldn't find any titles matching your current search filters.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedType('All'); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Clear all filters
                </button>
             </div>
        )}

      </Section>
    </div>
  );
};

export default Ratings;