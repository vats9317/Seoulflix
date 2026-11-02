import React from 'react';
import { CategoryFilter, SortOption } from '../types';
import { SlidersHorizontal, Sparkles, Flame, Star, Tv, Film, Heart } from 'lucide-react';

interface MediaFilterProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResultsCount: number;
}

const GENRES = [
  "सभी शैलियाँ",
  "रोमांस",
  "ड्रामा",
  "एक्शन",
  "थ्रिलर",
  "कॉमेडी",
  "फैंटेसी",
  "सागुक (ऐतिहासिक)",
  "हॉरर",
  "साइंस-फ़ाई",
  "क्राइम",
  "रहस्य व सस्पेंस"
];

export const MediaFilter: React.FC<MediaFilterProps> = ({
  activeCategory,
  onSelectCategory,
  selectedGenre,
  onSelectGenre,
  sortBy,
  onSortChange,
  totalResultsCount
}) => {
  return (
    <div className="space-y-4 py-4">
      {/* Category Tabs (Scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
            activeCategory === 'all'
              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          सभी कोरियन कंटेंट
        </button>

        <button
          onClick={() => onSelectCategory('tv')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
            activeCategory === 'tv'
              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Tv className="w-4 h-4 text-red-400" />
          कोरियन सीरीज़ (K-Drama)
        </button>

        <button
          onClick={() => onSelectCategory('movie')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
            activeCategory === 'movie'
              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Film className="w-4 h-4 text-rose-400" />
          कोरियन फ़िल्में (Movies)
        </button>

        <button
          onClick={() => onSelectCategory('hindi_dubbed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
            activeCategory === 'hindi_dubbed'
              ? 'bg-amber-400 border-amber-300 text-gray-950 shadow-lg shadow-amber-400/30'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20'
          }`}
        >
          <Sparkles className="w-4 h-4 fill-amber-400" />
          हिंदी डब स्पेशल (Hindi Dubbed)
        </button>

        <button
          onClick={() => onSelectCategory('trending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
            activeCategory === 'trending'
              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400" />
          टॉप ट्रेंडिंग
        </button>

        <button
          onClick={() => onSelectCategory('top_rated')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
            activeCategory === 'top_rated'
              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Star className="w-4 h-4 text-yellow-400" />
          सर्वश्रेष्ठ रेटिंग (8.5+)
        </button>

        <button
          onClick={() => onSelectCategory('watchlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
            activeCategory === 'watchlist'
              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Heart className="w-4 h-4 text-red-400" />
          मेरी वॉचलिस्ट
        </button>
      </div>

      {/* Secondary Bar: Genre chips and Sort control */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        
        {/* Genre Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre === "सभी शैलियाँ" ? "" : genre)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                (selectedGenre === genre || (genre === "सभी शैलियाँ" && !selectedGenre))
                  ? 'bg-white text-gray-950 font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between lg:justify-end gap-3 flex-shrink-0">
          <span className="text-xs text-gray-400 font-medium">
            <strong className="text-white">{totalResultsCount}</strong> टाइटल्स उपलब्ध
          </span>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="क्रमबद्ध करें (Sort By)"
              className="bg-transparent text-gray-200 outline-none cursor-pointer text-xs"
            >
              <option value="popularity.desc" className="bg-[#141622] text-white">सबसे लोकप्रिय</option>
              <option value="vote_average.desc" className="bg-[#141622] text-white">उच्चतम रेटिंग</option>
              <option value="primary_release_date.desc" className="bg-[#141622] text-white">नवीनतम रिलीज़</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
