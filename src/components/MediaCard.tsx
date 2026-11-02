import React, { useState } from 'react';
import { Play, Heart, Star, Sparkles, Info } from 'lucide-react';
import { KDramaItem } from '../types';

interface MediaCardProps {
  item: KDramaItem;
  onOpenDetails: (item: KDramaItem) => void;
  onOpenWatch: (item: KDramaItem, episodeNumber?: number) => void;
  onOpenTrailer: (trailerId: string, title: string) => void;
  isItemInWatchlist: (id: string | number) => boolean;
  onToggleWatchlist: (item: KDramaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onOpenDetails,
  onOpenWatch,
  onOpenTrailer,
  isItemInWatchlist,
  onToggleWatchlist
}) => {
  const [imgError, setImgError] = useState(false);
  const inWatchlist = isItemInWatchlist(item.id);

  // Reliable backup poster if TMDB CDN fails
  const backupPoster = item.type === 'movie'
    ? "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" // Parasite
    : "https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg"; // Squid Game

  const posterSrc = imgError ? backupPoster : (item.posterUrl || backupPoster);

  return (
    <div className="group relative bg-[#131520] hover:bg-[#1a1d2d] border border-white/5 hover:border-red-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/40 flex flex-col">
      
      {/* Poster Image Container */}
      <div 
        onClick={() => onOpenWatch(item)}
        className="relative w-full aspect-[2/3] overflow-hidden cursor-pointer bg-[#1a1c2a]"
      >
        <img
          src={posterSrc}
          alt={item.titleHindi}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {item.isHindiDubbed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-gray-950 shadow-md shadow-amber-400/40 tracking-tight">
                <Sparkles className="w-3 h-3 fill-gray-950" />
                हिंदी डब
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-gray-200 border border-white/10">
              {item.type === 'tv' ? 'सीरीज़' : 'फ़िल्म'}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/80 backdrop-blur-md text-yellow-400 border border-yellow-500/30">
            <Star className="w-3 h-3 fill-yellow-400" />
            {item.rating}
          </div>
        </div>

        {/* Watchlist Bookmark Icon (Clickable) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(item);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            inWatchlist 
              ? 'bg-red-600 text-white' 
              : 'bg-black/60 hover:bg-black text-gray-300 hover:text-white border border-white/20'
          }`}
          title={inWatchlist ? "वॉचलिस्ट से हटाएं" : "वॉचलिस्ट में जोड़ें"}
        >
          <Heart className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-white' : ''}`} />
        </button>

        {/* Center Hover Play Button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/60 transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-white translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Hover Actions Toolbar */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenWatch(item);
            }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-md transition-all"
            title="अभी देखें (Watch Now)"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            अभी देखें
          </button>

          {item.trailerYoutubeId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTrailer(item.trailerYoutubeId!, item.titleHindi);
              }}
              className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg backdrop-blur-md transition-all"
              title="ट्रेलर देखें"
            >
              ट्रेलर
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(item);
            }}
            className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-md transition-all"
            title="विवरण देखें"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Information */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div 
          onClick={() => onOpenDetails(item)} 
          className="cursor-pointer"
        >
          {/* Prominent Hindi Title */}
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-red-400 transition-colors line-clamp-1 leading-snug">
            {item.titleHindi}
          </h3>
          
          {/* Clean English & Korean Subtitle */}
          <p className="text-[11px] text-gray-400 font-medium line-clamp-1 mt-0.5">
            {item.titleEnglish} • <span className="text-gray-500">{item.titleOriginal}</span>
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
          <span>{item.releaseYear}</span>
          <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            1080p • 480p • सेवर
          </span>
          <span className="text-gray-300 font-medium">
            {item.type === 'tv' ? `${item.episodesCount || 16} एपिसोड्स` : item.duration}
          </span>
        </div>

        {/* Watch Now Direct Pill Button */}
        <button
          onClick={() => onOpenWatch(item)}
          className="w-full mt-1 py-1.5 bg-white/5 hover:bg-red-600 text-gray-300 hover:text-white border border-white/10 hover:border-red-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>ऑनलाइन देखें (Watch)</span>
        </button>

      </div>
    </div>
  );
};
