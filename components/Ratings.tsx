import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Calendar, Film, Tv, ExternalLink, ArrowUpDown } from 'lucide-react';
import Section from './Section';

// Direct reference to the file path relative to the public root
// This works when the development server serves the project root directly
const csvUrl = 'data/ecf554fc-c494-44fe-8508-63221f32ce9e.csv';

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

  // Custom CSV Parser
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
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((text) => {
        const rows = parseCSV(text);
        // Header: Const,Your Rating,Date Rated,Title,Original Title,URL,Title Type,IMDb Rating,Runtime (mins),Year,Genres,...
        // Indices: Rating: 1, Date: 2, Title: 3, URL: 5, Type: 6, IMDb: 7, Year: 9, Genres: 10
        const parsedData = rows.slice(1).map((row) => ({
          id: row[0],
          myRating: parseInt(row[1]) || 0,
          dateRated: row[2],
          title: row[3],
          url: row[5],
          type: row[6],
          imdbRating: parseFloat(row[7]) || 0,
          year: parseInt(row[9]) || 0,
          genres: row[10] ? row[10].split(',').map((g) => g.trim()) : [],
        })).filter(item => item.title); // Filter out empty rows
        
        setData(parsedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading CSV:', error);
        setLoading(false);
      });
  }, []);

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
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, searchTerm, selectedType, sortConfig]);

  const handleSort = (key: keyof RatingItem) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-neon-green';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-950">
      <Section id="ratings" title="My Watchlist Ratings" className="min-h-[80vh]">
        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800"
        >
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search titles, genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-neon-blue/50 transition-colors"
            />
          </div>

          {/* Filters & Sort */}
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
              {['All', 'Movie', 'TV'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedType === type 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleSort('myRating')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                sortConfig.key === 'myRating' ? 'bg-slate-800 border-neon-purple/50 text-neon-purple' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Star size={16} />
              Rating
              <ArrowUpDown size={14} />
            </button>

            <button
              onClick={() => handleSort('dateRated')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                sortConfig.key === 'dateRated' ? 'bg-slate-800 border-neon-blue/50 text-neon-blue' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Calendar size={16} />
              Date
              <ArrowUpDown size={14} />
            </button>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-neon-blue/5"
              >
                 {/* Card Header Background Gradient */}
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent group-hover:via-neon-blue/50 transition-all duration-500"></div>

                 <div className="p-5 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                         {item.type === 'Movie' ? <Film size={14} /> : <Tv size={14} />}
                         {item.year}
                      </div>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-slate-600 hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-neon-blue transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.genres.slice(0, 3).map((g, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] uppercase bg-slate-950 border border-slate-800 rounded text-slate-400">
                          {g}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-xs text-slate-500">My Rating</span>
                          <div className={`text-2xl font-bold ${getRatingColor(item.myRating)} flex items-center gap-1`}>
                            {item.myRating}<span className="text-sm text-slate-600 font-normal">/10</span>
                          </div>
                       </div>
                       
                       <div className="flex flex-col items-end">
                          <span className="text-xs text-slate-500">Watched on</span>
                          <span className="text-sm text-slate-300 font-mono">{item.dateRated}</span>
                       </div>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filteredData.length === 0 && (
            <div className="text-center py-20 text-slate-500">
                <p className="text-xl">No ratings found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedType('All'); }}
                  className="mt-4 text-neon-blue hover:underline"
                >
                  Clear filters
                </button>
            </div>
        )}
      </Section>
    </div>
  );
};

export default Ratings;