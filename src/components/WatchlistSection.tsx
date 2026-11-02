import React from 'react';
import { Heart, Trash2, ArrowLeft, Play } from 'lucide-react';
import { KDramaItem } from '../types';
import { MediaCard } from './MediaCard';

interface WatchlistSectionProps {
  watchlist: KDramaItem[];
  onOpenDetails: (item: KDramaItem) => void;
  onOpenWatch: (item: KDramaItem, episodeNumber?: number) => void;
  onOpenTrailer: (trailerId: string, title: string) => void;
  isItemInWatchlist: (id: string | number) => boolean;
  onToggleWatchlist: (item: KDramaItem) => void;
  onClearWatchlist: () => void;
  onBackToAll: () => void;
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({
  watchlist,
  onOpenDetails,
  onOpenWatch,
  onOpenTrailer,
  isItemInWatchlist,
  onToggleWatchlist,
  onClearWatchlist,
  onBackToAll
}) => {
  return (
    <div className="space-y-6 animate-fade-in py-2">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#141624] border border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToAll}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              <h2 className="text-xl sm:text-2xl font-black text-white">मेरी वॉचलिस्ट (My Saved List)</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              आपके पसंदीदा कोरियन ड्रामा और फिल्में जो आपने बाद में देखने के लिए सहेजी हैं
            </p>
          </div>
        </div>

        {watchlist.length > 0 && (
          <button
            onClick={onClearWatchlist}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            सूची साफ करें
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {watchlist.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onOpenDetails={onOpenDetails}
              onOpenWatch={onOpenWatch}
              onOpenTrailer={onOpenTrailer}
              isItemInWatchlist={isItemInWatchlist}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">आपकी वॉचलिस्ट खाली है</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              किसी भी कोरियन ड्रामा या फिल्म के कार्ड पर बने दिल (❤️) आइकन पर क्लिक करके उसे यहाँ सहेजें।
            </p>
          </div>
          <button
            onClick={onBackToAll}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-red-600/30"
          >
            कोरियन सीरीज़ ब्राउज़ करें
          </button>
        </div>
      )}
    </div>
  );
};
